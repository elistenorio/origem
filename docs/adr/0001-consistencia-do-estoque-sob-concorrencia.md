# ADR 0001: Consistência do estoque em pedidos concorrentes

- **Status:** Proposta (para discussão com a equipe)
- **Data:** 18/11/2026
- **Autora:** Eulália Regina Silva de Albuquerque
- **Decisão relacionada:** D-03 do registro de decisões pendentes (estratégia de isolamento transacional para atualizações concorrentes de estoque)
- **Código afetado:** `backend/src/infrastructure/repositories/pedidos.repository.ts` (`criarComBaixaDeEstoque`, `cancelar`), `backend/src/infrastructure/services/pedidos.service.ts` (`criar`), `backend/src/infrastructure/repositories/produtos.repository.ts` (`atualizarEstoqueEStatus`)

## 1. Atributo de qualidade prioritário

**Confiabilidade, no aspecto de integridade dos dados de estoque sob acesso concorrente.**

O Origem vende produção artesanal. Boa parte do catálogo tem estoque de uma ou poucas unidades, e o schema prevê explicitamente a peça única (`Produto.pecaUnica`). Nesse domínio, vender a mesma peça duas vezes não é um erro tolerável de "estoque negativo que se ajusta depois": o artesão não tem como produzir outra igual, um dos compradores fica sem a peça que pagou e a confiança na plataforma (que é a proposta de valor do Origem frente aos intermediários) é afetada diretamente.

O atributo é prioritário por três motivos:

1. **Impacto alto:** a falha afeta dinheiro, reputação do artesão e a relação comprador-plataforma.
2. **Baixa visibilidade:** condições de corrida não aparecem em testes sequenciais nem na demonstração com um usuário por vez. O problema só se manifesta com acessos simultâneos, ou seja, em produção.
3. **Mudança de contexto na Avaliação 2:** a Fake API da Avaliação 1 rodava em memória, em um processo, e não precisava lidar com isso. O backend real usa PostgreSQL (Supabase) com pool de conexões (pgbouncer) e o Render pode atender requisições em paralelo. A concorrência passou a ser real.

Atributos considerados e não priorizados neste ADR: desempenho (o volume esperado é baixo e o cache com Redis já está previsto para leitura), disponibilidade (limitada pelo plano gratuito do Render, fora do controle da arquitetura da aplicação) e segurança (já tratada por JWT em cookie httpOnly, `roleMiddleware` e CORS restrito).

## 2. Cenário de qualidade

| Elemento | Descrição |
|---|---|
| **Fonte do estímulo** | Compradores distintos (logados ou visitantes) |
| **Estímulo** | 20 requisições `POST /pedidos` disparadas ao mesmo tempo para a mesma peça, que tem `estoque = 1` |
| **Artefato** | Fluxo de criação de pedido: `pedidosService.criar` → `pedidosRepository.criarComBaixaDeEstoque` → tabela `Produto` |
| **Ambiente** | Operação normal em produção (Render + Supabase via pooler, `DATABASE_URL` com `pgbouncer=true`) |
| **Resposta** | O sistema aceita exatamente um pedido e recusa os demais com mensagem clara, sem deixar pedido gravado pela metade |
| **Medida da resposta** | (a) exatamente 1 resposta `201` e 19 respostas `409 OUT_OF_STOCK`; (b) nenhuma resposta `500`; (c) `estoque` final da peça igual a 0, nunca negativo; (d) invariante: `estoque inicial = estoque atual + soma das quantidades em ItemPedido de pedidos não cancelados`, para toda peça |

Cenário complementar (variação do mesmo atributo): dois carrinhos com as mesmas duas peças em ordens diferentes (`[A, B]` e `[B, A]`) finalizados ao mesmo tempo. Medida: nenhum `500` por deadlock; cada pedido termina em `201` ou `409`.

## 3. Análise da decisão

### 3.1 Requisitos e restrições

- **Requisito funcional:** `POST /pedidos` baixa o estoque; o cancelamento (`PATCH /pedidos/{id}`) devolve as peças (`docs/api.md`).
- **Requisito de qualidade:** cenário da seção 2.
- **Restrição de stack (eliminatória):** Node + TypeScript + Express + Prisma 6 + PostgreSQL. Tecnologias fora da stack precisam de aprovação e podem zerar o item na avaliação. Redis está previsto apenas para cache; processamento assíncrono ainda não foi decidido.
- **Restrição de contrato:** o frontend não pode mudar. `POST /pedidos` é síncrono e responde `201` com o `Pedido` ou `409 OUT_OF_STOCK`.
- **Restrição de infraestrutura:** Supabase acessado pelo pooler em modo transação (porta 6543). Bloqueios ou estado que dependam da sessão de banco além de uma transação não são confiáveis nesse modo.
- **Restrição de equipe:** seis integrantes precisam saber explicar o código na apresentação; a solução deve ser simples de ler.

### 3.2 Alternativas consideradas

| # | Alternativa | Benefícios | Custos e riscos | Avaliação |
|---|---|---|---|---|
| A | **Ler, conferir e gravar sem proteção** (comportamento da Fake API: lê o estoque, confere em código e grava o novo valor) | Mais simples | Janela entre a leitura e a escrita: duas compras leem `estoque = 1`, ambas passam na conferência e ambas gravam. Falha direta no cenário | Rejeitada |
| B | **Atualização condicional atômica dentro de transação** (`updateMany` com `where: { estoque: { gte: quantidade } }` e `decrement`, em `prisma.$transaction`, isolamento padrão Read Committed) | A conferência e a baixa acontecem no mesmo comando SQL; o PostgreSQL trava a linha durante o `UPDATE` e reavalia a condição para a segunda transação. Sem mudança de schema, sem SQL manual, sem nova tecnologia. Transação garante "tudo ou nada" para pedidos com várias peças. Funciona com o pooler em modo transação | Exige que **toda** escrita de estoque siga o mesmo padrão (ver consequências). Pedidos com várias peças podem entrar em deadlock se a ordem das linhas variar. Não reserva a peça durante o checkout | **Escolhida** |
| C | **Bloqueio pessimista** (`SELECT ... FOR UPDATE` antes de conferir e gravar) | Correção equivalente à B; padrão conhecido | Prisma não oferece `FOR UPDATE` na API tipada: exige `$queryRaw` dentro da transação. Mais código e mais tempo com a linha travada. Mesmo risco de deadlock por ordem | Rejeitada: mesma garantia que B com mais complexidade |
| D | **Bloqueio otimista** (coluna `versao` em `Produto`; grava só se a versão não mudou e repete em caso de conflito) | Não trava linhas; bom quando conflitos são raros | Migration nova, lógica de nova tentativa no service. Em peça única, conflito é justamente o caso comum, o que gera repetições inúteis. Para estoque, a condição `estoque >= quantidade` da alternativa B já cumpre o papel da versão | Rejeitada |
| E | **Isolamento `Serializable`** (`prisma.$transaction(fn, { isolationLevel: "Serializable" })`) | O banco garante que o resultado equivale a uma execução em série, mesmo para lógica de leitura e escrita em código | Transações abortadas com erro de serialização (Prisma `P2034`) precisam de nova tentativa no código; mais abortos sob disputa; mais difícil de explicar e de testar | Rejeitada para este caso; pode ser reavaliada se surgirem regras que envolvam várias tabelas |
| F | **Fila com consumidor único** (pedidos entram numa fila e um worker processa um por vez) | Elimina a disputa por serialização; escala para picos | Processamento assíncrono não foi decidido e exige tecnologia fora da stack atual; quebra o contrato síncrono (`201` com o pedido pronto); aumenta a infraestrutura no plano gratuito | Rejeitada no MVP. O tema é explorado em separado no trabalho de FCCPD (`elistenorio/fccpd-concorrencia-fila`) |
| G | **Lock distribuído com Redis** | Útil quando há vários bancos ou serviços | Redis está previsto só para cache; o banco único já oferece a garantia necessária; mais um ponto de falha | Rejeitada |

### 3.3 Trade-offs da escolha

- **Simplicidade e aderência à stack vs. flexibilidade:** a alternativa B resolve o caso com recursos nativos do PostgreSQL e do Prisma, mas só protege operações escritas no formato "condição + incremento/decremento". Regras mais complexas no futuro podem exigir E.
- **Consistência forte vs. experiência de checkout:** a peça não é reservada quando entra no carrinho. Quem perde a disputa só descobre ao finalizar (`409`). Para o MVP, isso é aceitável e o frontend já trata o erro com mensagem clara.
- **Atomicidade do pedido inteiro vs. pedido parcial:** a transação desfaz tudo se uma única peça faltar. O pedido não é aceito parcialmente.

## 4. Decisão

Adotar a **alternativa B** como padrão de arquitetura para qualquer alteração de estoque no backend:

1. A baixa de estoque acontece em um único `UPDATE` condicional (`updateMany` com `estoque: { gte: quantidade }` e `estoque: { decrement: quantidade }`), e o resultado (`count === 0`) indica falta de estoque.
2. Todas as baixas de um pedido e a criação do `Pedido`, dos `ItemPedido` e do primeiro `EventoPedido` ficam na mesma transação interativa (`prisma.$transaction`), com o isolamento padrão Read Committed.
3. A devolução ao estoque (cancelamento) usa `increment` relativo, nunca um valor absoluto calculado em código.
4. A conferência feita antes da transação, no service, serve só para devolver uma mensagem rápida; a garantia está no `UPDATE` condicional.

Essa decisão **formaliza o que já está implementado** em `pedidosRepository.criarComBaixaDeEstoque` e `pedidosRepository.cancelar` e propõe encerrar a D-03 com ela, junto com os dois ajustes descritos na seção 5.2.

## 5. Consequências

### 5.1 Positivas

- O cenário principal (20 compras simultâneas da última peça) é atendido sem nova tecnologia, sem migration e sem mudança no contrato da API.
- Pedidos com várias peças são "tudo ou nada": não há pedido gravado com parte das baixas.
- O estoque nunca fica negativo pelo fluxo de compra.
- A solução é curta e explicável: a regra cabe em um `where`.

### 5.2 Negativas, riscos e ajustes propostos

1. **Deadlock em pedidos com várias peças (risco identificado no código atual).** As baixas são feitas na ordem em que as peças chegam do carrinho. Dois pedidos com `[A, B]` e `[B, A]` ao mesmo tempo podem travar um ao outro; o PostgreSQL aborta um deles e o erro vira `500 INTERNAL`. **Ajuste proposto:** ordenar os itens por `produtoId` antes do laço de `updateMany` em `criarComBaixaDeEstoque` (uma linha de código).
2. **Atualização perdida no painel do artesão.** `PATCH /minha-conta/produtos/{id}` grava o estoque como valor absoluto (`produtosRepository.atualizarEstoqueEStatus`). Se o artesão abriu a tela com `estoque = 3`, uma compra baixou para 2 e ele salva 5 pensando em "adicionar duas", a venda é ignorada. Isso não cria venda dupla da mesma unidade, mas quebra a invariante do cenário. **Ajuste proposto (para discussão):** enviar o estoque esperado junto e gravar com `updateMany` condicionado a ele (respondendo `409 CONFLICT` se mudou), ou mudar a operação para "adicionar/remover unidades". A segunda opção muda o contrato e precisa de acordo com o frontend.
3. **Pedido parcial fica descartado.** A transação recusa o pedido inteiro quando falta uma peça. Isso responde, por consequência técnica, à decisão de produto ainda aberta sobre aceitar ou não pedidos parciais. A equipe precisa confirmar se esse é o comportamento desejado.
4. **Cache previsto com Redis.** Quando `GET /produtos` e `GET /produtos/{id}` passarem a usar cache, o estoque exibido pode ficar defasado. Isso é aceitável porque a verdade está no `UPDATE` condicional, mas o cache dessas chaves deve ser invalidado ao criar e cancelar pedidos, e o frontend deve continuar tratando `409 OUT_OF_STOCK` no checkout.
5. **Tempo de transação.** Transações interativas do Prisma têm tempo limite padrão de 5 s. Com o plano gratuito do Render (início a frio) e o banco em outra região, vale monitorar se pedidos grandes chegam perto desse limite.
6. **Regra de equipe.** Qualquer nova escrita em `Produto.estoque` precisa seguir os itens 1 a 3 da decisão. Proposta: registrar essa regra no `backend/CLAUDE.md` e checar em revisão de PR.

### 5.3 Fora do escopo

Os valores monetários (`preco`, `subtotal`, `total`, `precoUnitario`) estão como `Float` no schema, e o service arredonda para duas casas. Isso diverge da correção `BigDecimal` registrada no diagrama de classes revisado e merece um ADR próprio (atributo: corretude de cálculo), mas não interfere na consistência do estoque.

## 6. Verificação

A decisão é considerada válida quando os itens abaixo passarem:

1. **Teste de concorrência (cenário principal).** Script em TypeScript dentro de `backend/` que: cria ou ajusta uma peça com `estoque = 1`; dispara 20 `POST /pedidos` com `Promise.all`; conta as respostas. Esperado: 1 × `201`, 19 × `409 OUT_OF_STOCK`, 0 × `500`, e `estoque = 0` no banco ao final. Rodar contra o banco local (Docker) e uma vez contra o ambiente publicado.
2. **Teste de deadlock (cenário complementar).** Duas peças com estoque suficiente; 10 pares de pedidos simultâneos com as peças em ordens invertidas. Esperado: nenhum `500`. Antes do ajuste 5.2.1, este teste deve falhar de forma intermitente; depois, deve passar sempre.
3. **Consulta de invariante.** SQL executado após os testes e após o seed:
   para cada peça, `estoque atual + soma de ItemPedido.quantidade em pedidos com status diferente de "cancelado"` deve ser igual ao estoque inicial registrado no teste. Nenhuma linha com `estoque < 0`.
4. **Teste de cancelamento concorrente.** Dois `PATCH /pedidos/{id}` de cancelamento do mesmo pedido ao mesmo tempo. Esperado: um `200` e um `409 CONFLICT`; o estoque é devolvido uma única vez (garantido hoje pelo `updateMany` condicionado ao status).
5. **Revisão de código.** Busca por escritas em `estoque` (`grep -rn "estoque" backend/src`) a cada PR que toque em `repositories/`; toda escrita deve ser condicional ou relativa.

## 7. Referências

- `docs/api.md`, seção `POST /pedidos`
- `backend/CLAUDE.md` (fluxo route → controller → service → repository e stack permitida)
- Documentação do PostgreSQL, "Transaction Isolation", comportamento do `UPDATE` sob Read Committed
- Documentação do Prisma, "Transactions and batch queries" (transações interativas, `isolationLevel`, erro `P2034`)
- Nygard, M. *Documenting Architecture Decisions* (2011), formato de ADR
- Bass, L.; Clements, P.; Kazman, R. *Software Architecture in Practice*, cenários de atributos de qualidade (fonte, estímulo, artefato, ambiente, resposta, medida)
