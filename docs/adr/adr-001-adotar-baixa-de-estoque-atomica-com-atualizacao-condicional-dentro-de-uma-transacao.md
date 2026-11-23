# ADR-001: Adotar baixa de estoque atômica, com atualização condicional dentro de uma transação

- **Status:** Proposta
- **Data:** 2026-11-18 (revisado em 2026-11-23 para o modelo do estudo dirigido)
- **Autora:** EULÁLIA REGINA SILVA DE ALBUQUERQUE
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

Boa parte do catálogo do Origem tem uma ou poucas unidades, e o schema prevê a peça única (`Produto.pecaUnica`): o artesão não tem como produzir outra igual. Na Avaliação 2, a Fake API, que rodava em memória num só processo, foi substituída por um backend real (Node, TypeScript, Express, Prisma e PostgreSQL), no Render, com banco no Supabase acessado pelo pooler em modo transação. A partir daí, duas compras podem chegar ao mesmo tempo. A equipe é pequena, o prazo é de um semestre, a stack foi acordada com Desenvolvimento Web, o contrato de `POST /pedidos` é síncrono (201 com o pedido ou 409) e processamento assíncrono ainda não foi decidido.

## Preocupações

integridade do estoque, concorrência, confiança do comprador e do artesão, simplicidade, aderência à stack, prazo

## Decisão

Baixar o estoque com um único `UPDATE` condicional (`updateMany` com `estoque >= quantidade` e `decrement`) para cada peça e criar o pedido na mesma transação do Prisma, desfazendo tudo se alguma peça faltar. A devolução de estoque no cancelamento usa sempre `increment`, nunca um valor calculado em código.

## Justificativa

O cenário exige que, entre 20 compras simultâneas da última unidade, só uma passe. Com a conferência e a baixa no mesmo comando SQL, o PostgreSQL trava a linha durante o `UPDATE` e reavalia a condição para a compra seguinte, que encontra estoque 0 e não altera nada (`count === 0`): o service responde 409 OUT_OF_STOCK. A transação garante que um pedido com várias peças seja gravado inteiro ou não seja gravado. Tudo isso usa recursos nativos do PostgreSQL e do Prisma, sem nova tecnologia, sem migration e sem mudar o contrato da API. A conferência feita antes, no service, serve só para responder rápido; a garantia está no `UPDATE`.

## Consequências

Ganhos: o estoque nunca fica negativo pelo fluxo de compra e a mesma unidade não é vendida duas vezes; o pedido é "tudo ou nada"; a regra cabe num `where` e é fácil de explicar; funciona com o pooler do Supabase, porque cada transação usa uma só conexão.

Perdas: a garantia vale só para escritas feitas nesse formato, e nada no código impede alguém de escrever o estoque de outro jeito; o `PATCH /minha-conta/produtos/:id` do artesão grava o estoque como valor absoluto e pode apagar uma venda feita enquanto a tela estava aberta (atualização perdida); as baixas seguem a ordem do carrinho, então dois pedidos com as mesmas peças em ordens diferentes podem entrar em deadlock e um deles cai em 500 (correção proposta: ordenar os itens por `produtoId` antes do laço); a peça não é reservada no carrinho, e quem perde a disputa só descobre ao finalizar; o pedido parcial (só com as peças que ainda têm estoque) deixa de existir, o que precisa ser confirmado como decisão de produto; com o cache da vitrine (ADR-002), o estoque exibido pode ficar defasado por um instante, embora a compra continue decidida pelo banco.

## Alternativas consideradas

Ler, conferir e gravar sem proteção (como fazia a Fake API): descartado porque duas compras leem estoque 1 e as duas gravam. Bloqueio pessimista (`SELECT ... FOR UPDATE`): mesma garantia, mas exige `$queryRaw` e mantém a linha travada por mais tempo. Bloqueio otimista (coluna `versao` e nova tentativa): exige migration e lógica de repetição, e em peça única o conflito é o caso comum. Isolamento `Serializable`: exige tratar o erro de serialização (`P2034`) com nova tentativa e aborta mais transações sob disputa. Fila com um único consumidor (orientado a eventos): processamento assíncrono não foi decidido e quebraria a resposta síncrona do checkout; o tema é estudado à parte no trabalho de FCCPD. Lock distribuído no Redis: o Redis do projeto é só cache, e o banco único já dá a garantia.

## Rastreabilidade

**Atributo de qualidade:** Confiabilidade · Ausência de falhas (integridade dos dados de estoque sob acesso concorrente)

**Cenário que originou a decisão:**

> Em operação normal, com o backend no Render e o banco no Supabase, 20 compradoras finalizam ao mesmo tempo o pedido da mesma peça, que tem estoque 1 (POST /pedidos). O sistema aceita exatamente um pedido (201) e recusa os outros 19 com 409 OUT_OF_STOCK, sem nenhuma resposta 500 e sem gravar pedido pela metade. Ao final, o estoque da peça é 0, nunca negativo.

**Padrão arquitetural adotado:** Camadas (a regra fica no service e a garantia no repository, junto ao banco)

**Táticas empacotadas:** Transação atômica; Atualização condicional (controle de concorrência delegado ao banco)

backend/src/infrastructure/repositories/pedidos.repository.ts (`criarComBaixaDeEstoque`, `cancelar`), backend/src/infrastructure/services/pedidos.service.ts (`criar`), backend/src/infrastructure/repositories/produtos.repository.ts (`atualizarEstoqueEStatus`, ponto de atenção), backend/tests/concorrenciaEstoque.test.ts; HU-020 (Cenários 1 a 3); casos TC01, TC02 e TC39 do plano de testes; relacionado ao ADR-002 (cache) e ao ADR-005 (testes dos services)

## Verificação

- **Teste do cenário:** Teste automatizado backend/tests/concorrenciaEstoque.test.ts (`npm run test:estoque`, usando node:test, nativo do Node), contra a API ligada e com o seed aplicado: define o estoque da peça p10 como 1, dispara 20 `POST /pedidos` ao mesmo tempo e confere 1 resposta 201, 19 respostas 409 OUT_OF_STOCK, nenhuma outra resposta e estoque final 0, lido pela área do artesão (que consulta o banco, não o cache). Ao terminar, cancela o pedido criado e devolve o estoque original. O cenário passa se esse teste passar. Pode rodar localmente ou contra o backend do Render (variável `API_URL`).
- **Testes de componente que já existem:** TC01 e TC02 na suíte Jest (`npm test`) conferem a regra do service com o repository falso. Eles não exercitam o banco, por isso não substituem o teste do cenário.
