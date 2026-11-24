# API do Origem

## Visão geral

A API é o backend em `backend/` (Node.js + Express + Prisma + PostgreSQL). O frontend chama a URL de `NEXT_PUBLIC_API_URL` (local: `http://localhost:3001/api`, que é também o padrão quando a variável não existe). As rotas ficam em `backend/src/application/routes`.

Rotas: cadastro e autenticação (seção "Autenticação e cadastro", no fim), vitrine (`GET /produtos`, `/produtos/{id}`, `/produtos/{id}/relacionados`, `/filtros`, `/artesaos`, `/artesaos/{id}` e `/frete`), pedidos (`POST /pedidos`, `PATCH /pedidos/{id}`, `POST /avaliacoes`), Minha conta (`GET /minha-conta`, `/minha-conta/pedidos`, `/minha-conta/produtos`, `/minha-conta/resumo`, `/minha-conta/vendas`, `/minha-conta/perfil`, e criar, editar e excluir peça) e admin (`GET /admin/painel`, `/admin/indicadores`, `/admin/acompanhamento`, `/admin/pedidos`, `/admin/artesaos`, `/admin/usuarios`, `/admin/produtos`, `/admin/curadoria`, e as ações `PATCH /admin/artesaos/{id}`, `/admin/usuarios/{id}` e `/admin/curadoria/{tipo}/{id}`).

**Swagger:** com o backend rodando, a documentação interativa de todas as rotas fica em `/api/docs` (ex.: `http://localhost:3001/api/docs`). Para testar rotas com login, chame `POST /auth/login` pela própria página.

### Comportamentos gerais

- Datas em ISO 8601 com milissegundos (`"2026-09-20T10:00:00.000Z"`).
- `pageSize` tem máximo de 100: um valor maior vira 100.
- **Cache (Redis)** em `GET /produtos` e `GET /produtos/{id}`: a resposta traz o cabeçalho `X-Cache: HIT` (veio do cache) ou `MISS` (veio do banco). Cada resposta fica guardada por até 5 minutos, e o cache é zerado na hora em que uma peça muda (compra, cancelamento, estoque ou visibilidade alterados pelo artesão, edição ou exclusão da peça, mudança no perfil do artesão e decisões da curadoria). Sem Redis, as rotas funcionam igual, sempre com `MISS`.
- Ordem `relevancia` (padrão): vem da coluna `relevancia`, que o seed preenche na ordem do `backend/prisma/data/db.json`. Peças e artesãos novos entram no fim.
- **Login:** as rotas de `/minha-conta` identificam o usuário pelo cookie (sem login → `401`); as rotas de peças, `/minha-conta/resumo`, `/minha-conta/vendas` e `/minha-conta/perfil` são só do perfil `artesao`, e as de `/admin` só do `admin` (outro perfil → `403`). `PATCH /pedidos/{id}` e `POST /avaliacoes` também exigem login.
- **Pedidos:** `POST /pedidos` baixa o estoque e o cancelamento devolve as peças. O frete é recalculado pelo CEP (do `frete` enviado, só vale a `modalidade`). O número do pedido vem de uma sequência do banco (`10496`, `10497`...).
- As fotos são provisórias (Unsplash e picsum.photos).
- Nomes: o que é do domínio fica em português (`/produtos`, `titulo`, `preco`); o formato técnico de paginação e de erro fica em inglês (`items`, `page`, `error`).

### Onde está o código

| Pasta | Papel |
|---|---|
| `backend/src/application/` | rotas, controllers (validação do corpo) e o Swagger (`docs/openapi.ts`) |
| `backend/src/infrastructure/` | services (regras), repositories (Prisma) e o cache (Redis) |
| `backend/src/shared/types/` | o contrato no backend, igual ao de `frontend/src/types/` |
| `frontend/src/types/` | o contrato no frontend: formato de cada entidade e resposta |
| `frontend/src/services/` | as funções que as telas usam para chamar a API; `api.ts` tem a instância do axios usada por todos |

Fluxo: tela → hook `useApi` → service → `api` (axios) → backend → PostgreSQL.

## Formatos comuns

### Lista paginada (`Paginated<T>`)

Usada por `GET /produtos` e `GET /artesaos`.

```json
{ "items": [], "page": 1, "pageSize": 12, "total": 11 }
```

- `page` começa em 1 e `pageSize` tem padrão 12. Valor ausente ou inválido vira o padrão.
- `total` é quantos itens bateram com os filtros (para a paginação da tela).
- Uma página depois do fim devolve `items` vazio (não é erro).

### Erro (`ApiErrorBody`)

```json
{ "error": { "code": "NOT_FOUND", "message": "Peça não encontrada." } }
```

| Status | `code` | Quando |
|---|---|---|
| 400 | `VALIDATION` | dado enviado inválido (ex.: CEP, nota da avaliação, pedido sem peças) |
| 401 | `UNAUTHORIZED` | sem login, sessão inválida ou expirada, ou e-mail/senha incorretos |
| 403 | `FORBIDDEN` | logado, mas sem permissão: perfil errado, recurso de outro usuário ou conta suspensa |
| 404 | `NOT_FOUND` | o recurso não existe ou não está publicado |
| 409 | `OUT_OF_STOCK` | quantidade pedida maior que o estoque |
| 409 | `CONFLICT` | ação não permitida no estado atual (ex.: avaliar um pedido duas vezes, e-mail já cadastrado) |
| 500 | `INTERNAL` | erro inesperado no servidor |

O `services/api.ts` transforma essa resposta em um `ApiError` (com `code`, `message` e `status`), e a tela mostra a `message`. Sem resposta do servidor, o erro vira `NETWORK` (status 0).

## Rotas implementadas

### `GET /produtos`

Vitrine: catálogo, destaques da home e peças de um artesão. Só aparecem peças com `status` `publicado` cujo artesão também esteja `publicado` (peças de artesão em análise, com ajustes pedidos, indisponível ou recusado não aparecem na lista, na busca, no detalhe nem nos relacionados, e não podem ser compradas).

| Parâmetro | Valores | Observação |
|---|---|---|
| `busca` | texto | procura em título, artesão, cidade, categoria, técnica, material e tags; ignora acentos e maiúsculas (`ceramica` acha "Cerâmica"), com a extensão `unaccent` do PostgreSQL |
| `categoria` | id, ex.: `ceramica-barro` | ids de `constants/categorias.ts` (ou de `GET /filtros`) |
| `tecnica` | id, ex.: `modelagem-manual` | ids de `constants/tecnicas.ts` |
| `material` | id, ex.: `barro` | ids de `constants/materiais.ts` |
| `regiao` | id, ex.: `agreste` | ids de `constants/regioes.ts` |
| `artesaoId` | ex.: `a1` | peças de um artesão (perfil público) |
| `precoMin`, `precoMax` | números | faixa de preço |
| `disponivel` | `sim` | só peças com estoque |
| `ordenar` | `relevancia` (padrão), `menor_preco`, `maior_preco`, `recentes` | |
| `page`, `pageSize` | números | paginação |

Os filtros combinam entre si. Exemplo: `GET /api/produtos?categoria=ceramica-barro&regiao=zona-da-mata&ordenar=menor_preco`

Resposta: `Paginated<Produto>`. Cada item tem os mesmos campos do detalhe (abaixo); o card usa só os que precisa.

### `GET /produtos/{id}`

Detalhe de uma peça publicada. Exemplo: `GET /api/produtos/p1`

```json
{
  "id": "p1",
  "titulo": "Jarro Tradicional",
  "artesaoId": "a1",
  "artesaoNome": "Mestre Joãozinho",
  "cidade": "Tracunhaém",
  "tags": ["Peça única", "Barro"],
  "medidas": "15 × 27 × 15cm",
  "preco": 167.9,
  "imagemUrl": "https://images.unsplash.com/photo-...",
  "imagens": ["https://images.unsplash.com/photo-...", "https://picsum.photos/..."],
  "categoria": "ceramica-barro",
  "tecnica": "modelagem-manual",
  "material": "barro",
  "regiao": "zona-da-mata",
  "estoque": 1,
  "pecaUnica": true,
  "status": "publicado",
  "descricao": "Produzido manualmente em barro, o Jarro Tradicional carrega...",
  "cuidados": "Por se tratar de uma peça artesanal...",
  "criadoEm": "2026-09-20T10:00:00Z"
}
```

Erro: `404 NOT_FOUND` se a peça não existe ou não está publicada (rascunho, em análise, indisponível).

### `GET /produtos/{id}/relacionados`

"Peças relacionadas" do detalhe: lista de 4 `Produto`, sem paginação. Primeiro as peças publicadas da mesma categoria, depois as outras, completando 4.

É uma recomendação simples por categoria. Um módulo de recomendação pode assumir esta rota depois, com o mesmo endereço e o mesmo formato de resposta.

Erro: `404 NOT_FOUND` se a peça não existe ou não está publicada.

### `GET /filtros`

Opções dos filtros da vitrine, no formato `{ value, label }`.

```json
{
  "categorias": [{ "value": "ceramica-barro", "label": "Cerâmica e Barro" }],
  "tecnicas": [{ "value": "modelagem-manual", "label": "Modelagem manual" }],
  "materiais": [{ "value": "barro", "label": "Barro" }],
  "regioes": [{ "value": "agreste", "label": "Agreste" }]
}
```

As listas vêm das tabelas `Categoria`, `Tecnica`, `Material` e `Regiao`, na ordem da coluna `ordem`.

### `GET /artesaos`

Lista de artesãos publicados.

| Parâmetro | Valores | Observação |
|---|---|---|
| `busca` | texto | procura em nome, cidade e ofício; ignora acentos e maiúsculas |
| `regiao` | id, ex.: `agreste` | |
| `categoria` | id, ex.: `tecidos-bordados` | artesãos que trabalham com a categoria |
| `tecnica` | id, ex.: `renda` | |
| `page`, `pageSize` | números | paginação |

Resposta: `Paginated<Artesao>`, com os mesmos campos do perfil (abaixo).

### `GET /artesaos/{id}`

Perfil público do artesão. As peças dele vêm de `GET /produtos?artesaoId={id}`. Exemplo: `GET /api/artesaos/a1`

```json
{
  "id": "a1",
  "nome": "Mestre Joãozinho",
  "oficio": "Ceramista",
  "cidade": "Tracunhaém",
  "estado": "PE",
  "regiao": "zona-da-mata",
  "bio": "Há mais de 40 anos transforma o barro de Tracunhaém em jarros, moringas e santos.",
  "historia": "Foi em Tracunhaém que comecei a trabalhar com o barro...\n\nGosto do barro porque...",
  "citacao": "O barro guarda a memória de quem coloca a mão nele.",
  "trabalho": "Trabalho principalmente com barro e cerâmica...",
  "origemTrabalho": "Aqui o trabalho com o barro está muito presente...",
  "citacaoOrigem": "Tracunhaém faz parte do que eu faço.",
  "gostaDeFazer": "Gosto principalmente de trabalhar com peças...",
  "fotoUrl": "https://images.unsplash.com/photo-...",
  "tecnicas": ["Cerâmica", "Modelagem manual"],
  "categorias": ["ceramica-barro"],
  "totalProdutos": 6,
  "email": "joaozinho@email.com",
  "status": "publicado",
  "criadoEm": "2026-03-10T10:00:00Z"
}
```

- `historia` pode ter vários parágrafos, separados por uma linha em branco (`\n\n`).
- `trabalho`, `origemTrabalho`, `citacaoOrigem` e `gostaDeFazer` são **opcionais** (seções "Meu trabalho", "De onde vem o meu trabalho" e "O que gosto de fazer" do perfil). Só aparecem para quem tem o texto; hoje, só o Mestre Joãozinho.

Erro: `404 NOT_FOUND` se o artesão não existe ou não está publicado.

### `GET /frete?cep=`

Opções de frete para o CEP (carrinho, checkout e detalhe do produto). Simulação: CEPs de Pernambuco (começam de 50 a 56) pagam menos. Exemplo: `GET /api/frete?cep=50030-170`

```json
[
  { "modalidade": "pac", "nome": "PAC", "valor": 18.9, "prazo": "6 a 8 dias úteis" },
  { "modalidade": "sedex", "nome": "SEDEX", "valor": 27.5, "prazo": "2 a 4 dias úteis" }
]
```

Erro: `400 VALIDATION` se o CEP não tiver 8 números.

### `POST /pedidos`

Finaliza a compra (como visitante). A tela envia os itens do carrinho, os dados do comprador, o endereço, a opção de frete escolhida (uma das devolvidas por `GET /frete`) e o pagamento.

```json
{
  "itens": [{ "produtoId": "p10", "quantidade": 2 }],
  "comprador": { "nome": "Ana Beatriz Souza", "cpf": "123.456.789-00", "email": "ana.beatriz@email.com", "telefone": "(81) 99876-5432" },
  "endereco": { "cep": "50030-170", "rua": "Rua do Bom Jesus", "numero": "123", "complemento": "", "bairro": "Recife Antigo", "cidade": "Recife", "estado": "PE" },
  "frete": { "modalidade": "pac", "nome": "PAC", "valor": 18.9, "prazo": "6 a 8 dias úteis" },
  "pagamento": "pix",
  "parcelas": 1
}
```

Resposta `201` com o `Pedido` criado: `status` `processando`, título e preço de cada peça "fotografados" no momento da compra, `subtotal` e `total` calculados pela API.

- Aberta a visitantes. Se houver login (cookie), o pedido fica ligado à conta e aparece em `GET /minha-conta/pedidos`.
- Preço, título e artesão vêm do banco, nunca do corpo enviado.
- Do `frete`, só a `modalidade` (`pac` ou `sedex`) é usada: valor e prazo são recalculados pelo CEP do endereço, com a mesma regra de `GET /frete`.
- Baixa o estoque de cada peça, numa transação. Se duas compras disputarem a última unidade, só uma passa (a outra recebe `409 OUT_OF_STOCK`).
- A mesma peça em duas linhas de `itens` vira uma linha só, com as quantidades somadas.
- `parcelas` é opcional (padrão 1), de 1 a 12.

```json
{
  "id": "10496",
  "codigo": "#10496",
  "status": "processando",
  "criadoEm": "2026-09-25T18:00:00.000Z",
  "itens": [{ "produtoId": "p10", "titulo": "Quartinha", "imagemUrl": "https://...", "artesaoNome": "Mestre Joãozinho", "precoUnitario": 98, "quantidade": 2 }],
  "subtotal": 196,
  "frete": { "modalidade": "pac", "valor": 18.9, "prazo": "6 a 8 dias úteis" },
  "total": 214.9,
  "comprador": { "...": "o que foi enviado" },
  "endereco": { "...": "o que foi enviado" },
  "pagamento": "pix",
  "parcelas": 1,
  "eventos": [{ "titulo": "Pedido recebido", "data": "2026-09-25T18:00:00.000Z" }],
  "avaliado": false
}
```

Erros:
- `400 VALIDATION`: sem peças, sem nome ou e-mail do comprador, sem CEP, sem frete ou sem forma de pagamento; quantidade que não é inteiro de pelo menos 1, e-mail inválido, CEP sem 8 números, modalidade de frete ou forma de pagamento desconhecida, parcelas fora de 1 a 12.
- `404 NOT_FOUND`: uma das peças não existe ou não está mais publicada.
- `409 OUT_OF_STOCK`: quantidade maior que o estoque da peça.

Os dados do cartão não são enviados.

### `GET /minha-conta`

Dados do usuário logado (qualquer perfil; sem login → `401`): os campos de `Usuario` mais CPF mascarado, telefone, endereço e formas de pagamento; campos ainda não preenchidos voltam vazios (`""`, endereço com campos vazios e `formasPagamento: []`).

```json
{
  "id": "u1",
  "nome": "Ana Beatriz Souza",
  "email": "ana.beatriz@email.com",
  "perfil": "comprador",
  "status": "ativo",
  "cidade": "Recife/PE",
  "criadoEm": "2026-06-12T10:00:00Z",
  "cpf": "***.456.789-**",
  "telefone": "(81) 99876-5432",
  "endereco": { "cep": "50030-170", "rua": "Rua do Bom Jesus", "numero": "123", "complemento": "Apto. 402", "bairro": "Recife Antigo", "cidade": "Recife", "estado": "PE" },
  "formasPagamento": [{ "titulo": "Pix", "detalhe": "Pagamento na hora, sem cadastro" }]
}
```

### Ações de Minha conta

Todas exigem login (qualquer perfil; sem login → `401`). As que devolvem a conta respondem `200` com o `MinhaConta` atualizado, que agora traz também `preferencias: { newsletter, novidadesArtesaos, whatsapp }` (padrão `true`, `true`, `false`).

| Rota | Corpo | O que faz | Erros `400 VALIDATION` |
|---|---|---|---|
| `PATCH /minha-conta` | `{ nome, telefone, cpf? }` | salva nome e telefone; `cpf` (11 números) é guardado mascarado (`***.456.789-**`); sem `cpf`, mantém o atual | nome vazio, telefone sem DDD, CPF sem 11 números |
| `PUT /minha-conta/endereco` | `Endereco` | salva o endereço de entrega e a cidade do usuário (`Recife/PE`) | CEP sem 8 números, rua, número, bairro ou cidade vazios, estado sem 2 letras |
| `PUT /minha-conta/senha` | `{ senhaAtual, novaSenha }` | troca a senha; resposta `204` | senha atual errada, nova senha com menos de 8 caracteres ou sem caractere especial |
| `PUT /minha-conta/preferencias` | `{ newsletter, novidadesArtesaos, whatsapp }` | salva as preferências (os três como `true`/`false`) | algum campo que não é `true`/`false` |
| `POST /minha-conta/formas-pagamento` | `{ bandeira, ultimosDigitos }` | guarda `{ titulo: "Cartão Visa", detalhe: "final 4242" }`; resposta `201`. **Nunca recebe nem guarda o número completo nem o CVV** | bandeira fora de Visa, Mastercard, Elo, American Express e Hipercard; `ultimosDigitos` sem exatamente 4 números |
| `DELETE /minha-conta/formas-pagamento/{indice}` | — | remove a forma de pagamento nessa posição da lista | — (`404` se a posição não existe) |
| `DELETE /minha-conta` | `{ senha }` | exclui a conta de **comprador** e apaga o cookie; resposta `204`. Os pedidos ficam guardados, sem ligação com a conta | senha errada |

Outros erros: `409 CONFLICT` ao guardar mais de 5 formas de pagamento, e ao tentar excluir conta de artesão ou de admin (encerradas pelo suporte).

### `GET /minha-conta/pedidos`

"Meus pedidos": lista de `Pedido` **ligados à conta logada** (feitos com login), do mais recente para o mais antigo. Sem paginação. Pedidos feitos como visitante com o mesmo e-mail não entram. Erro: `401 UNAUTHORIZED` sem login.

### `POST /avaliacoes`

Avaliação de um pedido entregue ("Avaliar o pedido" em Meus pedidos).

```json
{ "pedidoId": "10402", "nota": 5, "comentario": "Peça linda!", "notas": { "produto": 5, "embalagem": 4 } }
```

Resposta `201` com a `Avaliacao` (os mesmos campos, mais `id` e `criadoEm`). O pedido passa a ter `avaliado: true`.

Erros:
- `400 VALIDATION`: nota fora de 1 a 5 (também as notas de `notas`, quando enviadas).
- `401 UNAUTHORIZED`: sem login.
- `403 FORBIDDEN`: o pedido não é de quem está logado.
- `404 NOT_FOUND`: o pedido não existe.
- `409 CONFLICT`: o pedido não foi entregue ou já foi avaliado.

### `PATCH /pedidos/{id}`

Atualiza o pedido. Exemplo: `PATCH /api/pedidos/10495`. São dois usos:

**Cancelar** ("Cancelar o pedido" em Meus pedidos): só antes do envio (`processando` ou `emSeparacao`). Pode ser feito pelo dono do pedido ou pelo admin.

```json
{ "status": "cancelado", "motivo": "Comprei por engano", "observacao": "opcional" }
```

Resposta `200` com o `Pedido` atualizado: `status` `cancelado`, `motivoCancelamento` preenchido e um evento "Pedido cancelado" no fim de `eventos`. Cancelar devolve as peças do pedido ao estoque.

**Avançar o andamento** (só admin, na tela Acompanhamento): uma etapa por vez, `processando` → `emSeparacao` → `enviado` → `entregue`.

```json
{ "status": "enviado", "codigoRastreio": "BR123456789BR" }
```

| `status` enviado | Precisa estar | Evento registrado | O que mais muda |
|---|---|---|---|
| `emSeparacao` | `processando` | "Pedido separado" | — |
| `enviado` | `emSeparacao` | "Pedido enviado" | grava `codigoRastreio` (obrigatório) e calcula `previsaoEntrega` somando o maior prazo do frete em dias úteis (ex.: "6 a 8 dias úteis" → 8) |
| `entregue` | `enviado` | "Pedido entregue" | o comprador passa a poder avaliar (`POST /avaliacoes`) |

Resposta `200` com o `Pedido` atualizado.

Erros:
- `400 VALIDATION`: `status` inválido, cancelamento sem `motivo` ou envio sem `codigoRastreio`.
- `401 UNAUTHORIZED`: sem login.
- `403 FORBIDDEN`: cancelar pedido de outra pessoa (sem ser admin) ou avançar o andamento sem ser admin.
- `404 NOT_FOUND`: o pedido não existe.
- `409 CONFLICT`: o pedido não está na etapa certa (ex.: cancelar depois do envio, marcar como entregue um pedido em separação) ou mudou ao mesmo tempo por outra pessoa.

### `GET /minha-conta/produtos`

"Meu catálogo" e "Estoque" do artesão logado. Lista de `Produto` com **todas** as peças dele, em qualquer `status` (publicada, em análise, rascunho, indisponível), das mais recentes para as mais antigas. Sem paginação e sem filtros: busca, filtros e ordem são feitos na tela.

### `GET /minha-conta/resumo`

Números do topo de "Meu catálogo" e "Estoque" do artesão logado.

```json
{
  "catalogo": { "publicadas": 3, "emAnalise": 0, "vendidas": 3, "indisponiveis": 1 },
  "estoque": { "disponiveis": 2, "baixoEstoque": 1, "esgotadas": 1 }
}
```

- `vendidas`: soma das quantidades das peças do artesão em pedidos que não foram cancelados.
- `estoque`: conta só as peças publicadas ou indisponíveis; `baixoEstoque` é 1 unidade (`LIMITE_BAIXO_ESTOQUE`).

### `GET /minha-conta/painel`

Tela inicial do artesão logado (só perfil `artesao`).

```json
{
  "nome": "Mestre Joãozinho", "status": "publicado",
  "publicadas": 3, "vendidasSemana": 1, "vendasMes": 167.9, "avaliacaoMedia": 5, "totalAvaliacoes": 1,
  "notificacoes": [{ "titulo": "Novo pedido recebido", "descricao": "Jarro Tradicional · R$ 167,90", "data": "2026-11-22T22:35:47.276Z" }]
}
```

- `vendidasSemana`: unidades das peças dele em pedidos não cancelados dos últimos 7 dias. `vendasMes`: valor dessas peças (sem frete) no mês atual, no horário de Recife.
- `avaliacaoMedia`: média das notas dos pedidos que têm peças dele (`null` sem avaliações).
- `notificacoes`: as 5 mais recentes entre pedidos novos, avaliações e decisões da curadoria sobre o perfil e as peças dele.
- `parecerCuradoria` aparece quando a curadoria pediu ajustes ou recusou o perfil.
- Erros: `401 UNAUTHORIZED`; `403 FORBIDDEN` para quem não é artesão; `404 NOT_FOUND` sem perfil de artesão.

### `GET /minha-conta/vendas`

Tela "Pedidos" do artesão logado: os pedidos que têm peças dele, dos mais recentes para os mais antigos. Cada pedido traz **só os itens do artesão** e não traz os dados pessoais do comprador (só a cidade de entrega).

```json
[
  {
    "id": "10495",
    "codigo": "#10495",
    "status": "enviado",
    "criadoEm": "2026-09-20T11:43:00.000Z",
    "itens": [{ "produtoId": "p1", "titulo": "Jarro Tradicional", "imagemUrl": "https://...", "artesaoNome": "Mestre Joãozinho", "precoUnitario": 167.9, "quantidade": 1 }],
    "subtotal": 167.9,
    "cidade": "Recife/PE",
    "codigoRastreio": "BR123456789BR",
    "previsaoEntrega": "2026-12-03T14:00:00.000Z"
  }
]
```

- `subtotal`: soma só das peças do artesão (sem frete).
- `codigoRastreio` e `previsaoEntrega` só aparecem depois do envio.
- Erros: `401 UNAUTHORIZED` sem login; `403 FORBIDDEN` para quem não é artesão.

### `PATCH /minha-conta/produtos/{id}`

O artesão logado atualiza o estoque de uma peça dele e/ou a esconde (`indisponivel`) e mostra de novo (`publicado`) na vitrine. Os dois campos são opcionais, mas pelo menos um é obrigatório. Exemplo: `PATCH /api/minha-conta/produtos/p10`

```json
{ "estoque": 5 }
```

```json
{ "status": "indisponivel" }
```

Resposta `200` com o `Produto` atualizado.

Erros:
- `400 VALIDATION`: nenhum campo enviado, estoque negativo, acima de 999 ou não inteiro, ou status diferente de `publicado`/`indisponivel`.
- `401 UNAUTHORIZED` / `403 FORBIDDEN`: sem login / perfil diferente de `artesao` (vale também para `GET /minha-conta/produtos` e `/minha-conta/resumo`).
- `404 NOT_FOUND`: a peça não existe ou não é do artesão logado.
- `409 CONFLICT`: tentar esconder ou mostrar uma peça que ainda não foi publicada (rascunho ou em análise).

### `POST /minha-conta/produtos`

O artesão logado cadastra uma peça nova ("Adicionar peça"). Corpo: `ProdutoInput` (`frontend/src/types/produto.ts`).

```json
{
  "titulo": "Moringa Azul", "categoria": "ceramica-barro", "tecnica": "modelagem-manual", "material": "barro",
  "descricao": "Moringa feita à mão em Tracunhaém.",
  "altura": "20", "largura": "12", "profundidade": "12", "peso": "1,2",
  "pecaUnica": false, "estoque": 3, "preco": 89.9,
  "prazoPostagem": "3", "embalagem": "caixa", "cuidadosEnvio": "Peça frágil.",
  "enviarParaAnalise": true
}
```

Resposta `201` com o `Produto` criado:
- `status`: `emAnalise` quando `enviarParaAnalise` é `true` (vai para a curadoria e só aparece na vitrine depois de aprovada); senão `rascunho`.
- `medidas`: `"largura × altura × profundidade" + "cm"` (ex.: `"12 × 20 × 12cm"`); vazio se nenhuma medida foi informada.
- `tags`: `"Peça única"` (quando for) e o nome do material.
- Peça única fica sempre com `estoque: 1`.
- `regiao`, `artesaoNome` e `cidade` vêm do artesão. As fotos ainda não são enviadas: `imagemUrl` e `imagens` recebem uma foto de exemplo.
- `peso`, `prazoPostagem` e `embalagem` voltam no `Produto` (campos opcionais, só nas peças cadastradas pelo formulário).

Erros:
- `400 VALIDATION`: falta nome, categoria, técnica ou material; categoria, técnica ou material que não existe; medida ou peso que não é número (aceita vírgula ou ponto); preço ou quantidade negativos; quantidade acima de 999; `prazoPostagem` diferente de `1`, `3` ou `7`; `embalagem` diferente de `caixa`, `envelope` ou `tubo`. Para enviar à análise, também são obrigatórios descrição, preço maior que zero e quantidade (se não for peça única). A mensagem é a mesma que o formulário mostra.
- `401 UNAUTHORIZED` / `403 FORBIDDEN`: sem login / perfil diferente de `artesao` (vale para todas as rotas abaixo).

### `PUT /minha-conta/produtos/{id}`

O artesão salva as mudanças de uma peça dele ("Editar peça"). Corpo e validações iguais aos do `POST`. Resposta `200` com o `Produto` atualizado.

- **Toda edição volta para a curadoria** (`emAnalise`) ou para `rascunho`, conforme `enviarParaAnalise`: o admin confere de novo antes de a peça voltar para a vitrine.
- Fotos, região e relevância continuam como estavam.

Erros: os do `POST`, mais `404 NOT_FOUND` (a peça não existe ou não é do artesão logado) e `409 CONFLICT` (peça com status `vendida` ou `recusado`).

Peça com `ajustesSolicitados` pode ser editada: salvar com `enviarParaAnalise: true` manda de volta para a curadoria. O `Produto` das rotas do artesão traz `parecerCuradoria` quando a curadoria pediu ajustes ou recusou.

### `DELETE /minha-conta/produtos/{id}`

O artesão apaga uma peça dele. Resposta `204`, sem corpo.

Erros:
- `404 NOT_FOUND`: a peça não existe ou não é do artesão logado.
- `409 CONFLICT`: a peça já está em algum pedido (o pedido guarda a ligação com ela). Nesse caso, o artesão pode escondê-la da vitrine com `PATCH /minha-conta/produtos/{id}`.

### `GET /minha-conta/perfil`

Perfil do artesão logado ("Meu perfil"), em qualquer status. É o `Artesao` de `GET /artesaos/{id}` com dois campos a mais, que só ele vê (tipo `PerfilArtesao`):

```json
{ "id": "a1", "nome": "Mestre Joãozinho", "cidade": "Tracunhaém", "estado": "PE", "...": "...", "telefone": "(81) 98888-7777", "tempoAtuacao": "mais-10" }
```

- `telefone`: do usuário ligado ao artesão; `""` se não foi preenchido.
- `tempoAtuacao`: `menos-1`, `1-3`, `3-10` ou `mais-10`; `""` se não foi preenchido.

Erros: `404 NOT_FOUND` se o usuário não tiver perfil de artesão.

### `PUT /minha-conta/perfil`

Salva o perfil do artesão logado. Corpo (`PerfilArtesaoInput`):

```json
{
  "nome": "Mestre Joãozinho", "cidade": "Tracunhaém", "estado": "PE", "telefone": "(81) 98888-7777",
  "historia": "Aprendi com os mais velhos de Tracunhaém.", "trabalho": "", "origemTrabalho": "", "gostaDeFazer": "",
  "tempoAtuacao": "mais-10", "categorias": ["ceramica-barro"], "tecnicas": ["Modelagem manual", "Queima a lenha"]
}
```

Resposta `200` com o `PerfilArtesao` salvo. As mudanças aparecem na hora no perfil público (`GET /artesaos/{id}`).
- `trabalho`, `origemTrabalho` e `gostaDeFazer` vazios somem do perfil público (a seção não aparece).
- O e-mail não muda por esta rota. O estado é gravado em maiúsculas.
- Se o artesão estava com `ajustesSolicitados`, salvar manda o perfil de volta para a curadoria (`emAnalise`). O `PerfilArtesao` traz `parecerCuradoria` quando houver.

Erros:
- `400 VALIDATION`: falta nome, cidade, história ou área de atuação (`categorias` vazio); estado sem 2 letras; telefone com menos de 10 números; `tempoAtuacao` fora das faixas.
- `404 NOT_FOUND`: o usuário não tem perfil de artesão.

### `GET /admin/painel`

Tela inicial do administrador: resumo da plataforma, pendências, notificações e atividades recentes.

```json
{
  "resumo": { "pedidosHoje": 18, "vendasMes": 24380, "artesaosAtivos": 4, "produtosPublicados": 11, "clientes": 5 },
  "pendencias": [
    { "id": "pd1", "titulo": "Artesãos aguardando curadoria", "quantidade": 3, "href": "/admin/curadoria" },
    { "id": "pd2", "titulo": "Peças aguardando aprovação", "quantidade": 1, "href": "/admin/curadoria" },
    { "id": "pd3", "titulo": "Pedidos em processamento", "quantidade": 1, "href": "/admin/acompanhamento" }
  ],
  "notificacoes": [{ "id": "n1", "titulo": "Novo artesão cadastrado", "descricao": "Zezinha do Barro, Caruaru, enviou documentos para análise." }],
  "atividades": [{ "id": "at1", "autor": "Maria Clara", "descricao": "aprovou a peça “Natureza Onírica”", "data": "2026-09-25T13:55:00Z" }]
}
```

- Exige login (`401`) e perfil `admin` (`403`).
- **Todos os números do `resumo` são contados no banco**: `pedidosHoje` (pedidos criados desde 0h), `vendasMes` (soma do `total` dos pedidos não cancelados do mês), `clientes` (usuários com perfil `comprador`), `artesaosAtivos` e `produtosPublicados`. "Hoje" e "mês" seguem o horário de Recife.
- `pendencias`: artesãos e peças com status `emAnalise`, e pedidos `processando` ou `emSeparacao`.
- `notificacoes` e `atividades`: tabelas `Notificacao` e `Atividade`, preenchidas pelo seed, das mais recentes para as mais antigas (até 10 de cada). As decisões da curadoria (`PATCH /admin/curadoria/{tipo}/{id}`) criam novas atividades; notificações novas ainda não são criadas por nenhuma ação.

### `GET /admin/acompanhamento`

Só admin. Tela Acompanhamento: contagem dos pedidos, alertas e filas.

```json
{
  "contagem": { "processando": 1, "enviado": 1, "entregue": 1, "cancelado": 1 },
  "alertas": [{ "id": "atraso-10495", "titulo": "Envio atrasado", "descricao": "Pedido #10495 aguardando envio há 4 dias", "gravidade": "media" }],
  "artesaosRecentes": [ /* Artesao, como em GET /artesaos/{id} */ ],
  "produtosPendentes": [ /* Produto, como em GET /produtos/{id} */ ],
  "atividades": [{ "id": "at1", "autor": "Maria Clara", "descricao": "aprovou a peça “Natureza Onírica”", "data": "2026-09-25T13:55:00.000Z" }]
}
```

- `contagem`: pedidos por status; `processando` soma `processando` e `emSeparacao`.
- `alertas`: pedidos ainda não enviados (`processando` ou `emSeparacao`) feitos há mais de 3 dias, dos mais antigos para os mais novos (até 5). `gravidade` é `alta` com mais de 7 dias, senão `media`.
- `artesaosRecentes`: os 3 últimos artesãos cadastrados, em qualquer status.
- `produtosPendentes`: até 5 peças em análise (`emAnalise`), das mais recentes para as mais antigas.
- `atividades`: as 5 mais recentes da tabela `Atividade`.
- Erros: `401 UNAUTHORIZED` sem login; `403 FORBIDDEN` para quem não é admin.

### `GET /admin/pedidos`

Só admin. Lista de pedidos da tela Acompanhamento, dos mais recentes para os mais antigos, em `Paginated<Pedido>`.

| Parâmetro | Exemplo | Descrição |
|---|---|---|
| `status` | `emSeparacao` | só pedidos com esse status (`processando`, `emSeparacao`, `enviado`, `entregue`, `cancelado`); valor desconhecido é ignorado |
| `busca` | `10495` ou `Pedro` | parte do número do pedido (com ou sem `#`) ou do nome do comprador (diferencia maiúsculas) |
| `page`, `pageSize` | `1`, `10` | paginação |

Erros: `401 UNAUTHORIZED` sem login; `403 FORBIDDEN` para quem não é admin.

### `GET /admin/indicadores?periodo=`

Só admin. Tela Indicadores e Visão geral. `periodo` é `7d`, `30d` (padrão) ou `12m` (365 dias); valor desconhecido vira `30d`.

```json
{
  "periodo": "30d",
  "faturamento": 186.8, "pedidos": 1, "ticketMedio": 186.8, "pecasVendidas": 1,
  "artesaosAtivos": 4, "clientes": 6, "produtosPublicados": 8,
  "variacoes": { "faturamento": 100, "pedidos": 100, "ticketMedio": 100, "pecasVendidas": 100 },
  "faturamentoMensal": [{ "mes": "dez", "atual": 0, "anterior": 0 }],
  "vendasPorCategoria": [{ "categoria": "Cerâmica e Barro", "quantidade": 1 }],
  "pedidosPorSemana": [{ "semana": "15/11", "quantidade": 1 }]
}
```

- Tudo é calculado no banco, só com pedidos **não cancelados**. `faturamento` soma o `total` (com frete), `pecasVendidas` soma as quantidades e `ticketMedio` é faturamento ÷ pedidos.
- `variacoes`: % em relação ao período anterior de mesmo tamanho (sem pedidos antes e com pedidos agora, 100).
- `artesaosAtivos`, `clientes` e `produtosPublicados`: totais de hoje (não dependem do período).
- `faturamentoMensal`: os últimos 12 meses (horário de Recife), cada um comparado ao mesmo mês do ano anterior.
- `vendasPorCategoria`: peças vendidas no período, por categoria (as 5 maiores e "Outras").
- `pedidosPorSemana`: as últimas 8 semanas (blocos de 7 dias terminando agora); `semana` é o dia em que o bloco começa.
- Erros: `401 UNAUTHORIZED` sem login; `403 FORBIDDEN` para quem não é admin.

### `GET /admin/artesaos`, `GET /admin/usuarios` e `GET /admin/produtos`

Só admin. Listas da tela Gestão, em `Paginated<T>`, das mais recentes para as mais antigas, em qualquer status.

| Rota | Itens | `busca` procura em | `status` aceita |
|---|---|---|---|
| `GET /admin/artesaos` | `Artesao` | nome, cidade e e-mail | `publicado`, `emAnalise`, `ajustesSolicitados`, `indisponivel`, `recusado` |
| `GET /admin/usuarios` | `Usuario` (só compradores) | nome, e-mail e cidade | `ativo`, `suspenso` |
| `GET /admin/produtos` | `Produto` | título e nome do artesão | os status de peça |

A busca ignora maiúsculas (não ignora acentos). `status` desconhecido é ignorado. Paginação com `page` e `pageSize`. Erros: `401 UNAUTHORIZED`; `403 FORBIDDEN`.

### `PATCH /admin/artesaos/{id}`

Só admin. Suspende (`{ "status": "indisponivel" }`) ou reativa (`{ "status": "publicado" }`) um artesão. Resposta `204`, sem corpo.

- Só um artesão `publicado` pode ser suspenso, e só um `indisponivel` pode ser reativado; os outros status passam pela curadoria.
- Suspenso, o artesão e as peças dele saem da vitrine na hora (o cache é zerado). Ele continua entrando na conta.
- Registra uma atividade no painel (ex.: "Maria Clara suspendeu o artesão “Carla Maria”").
- Erros: `400 VALIDATION` (status inválido); `401`; `403`; `404 NOT_FOUND`; `409 CONFLICT` (status atual não permite a ação).

### `PATCH /admin/usuarios/{id}`

Só admin. Suspende (`{ "status": "suspenso" }`) ou reativa (`{ "status": "ativo" }`) um **cliente** (perfil `comprador`). Resposta `204`, sem corpo.

- Conta suspensa perde o acesso na hora: toda rota com login passa a responder `403 FORBIDDEN` ("Esta conta está suspensa"), mesmo com o cookie de antes, e o login também é recusado.
- Registra uma atividade no painel (ex.: "Maria Clara suspendeu o cliente pedro.h@email.com").
- Erros: `400 VALIDATION`; `401`; `403`; `404 NOT_FOUND` (não existe ou não é comprador); `409 CONFLICT` (já está nesse status).

### `GET /admin/curadoria?tipo=`

Só admin. Fila da tela Curadoria: artesãos (`tipo=artesaos`) ou peças (`tipo=pecas`) com status `emAnalise`, dos mais recentes para os mais antigos, no formato `ItemCuradoria`.

```json
[
  {
    "id": "a7",
    "tipo": "artesaos",
    "titulo": "Antônio Lopes",
    "subtitulo": "Bezerros/PE · Mascareiro",
    "enviadoEm": "2026-09-21T10:00:00.000Z",
    "imagemUrl": "https://...",
    "fotos": ["https://..."],
    "descricao": "Máscaras de papangu entalhadas em madeira e pintadas à mão.",
    "trajetoria": "Faz máscaras do carnaval de Bezerros desde menino.",
    "documentos": [],
    "historico": [
      { "titulo": "Cadastro concluído", "data": "2026-09-21T10:00:00.000Z" },
      { "titulo": "Ajustes solicitados por Maria Clara: “Envie fotos das peças.”", "data": "2026-11-22T21:00:00.000Z" }
    ]
  }
]
```

- Artesão: `descricao` é a `bio`, `trajetoria` é a `historia` e `fotos` tem a foto do perfil.
- Peça: `subtitulo` é "artesão · técnica", `descricao` junta descrição, medidas e preço, e `fotos` são as imagens da peça.
- `documentos` vem vazio: o cadastro de artesão ainda não envia documentos.
- `historico`: o envio e as decisões anteriores da curadoria sobre o item (ex.: ajustes pedidos antes de o artesão reenviar).
- Erros: `400 VALIDATION` com `tipo` diferente de `artesaos` e `pecas`; `401 UNAUTHORIZED` sem login; `403 FORBIDDEN` para quem não é admin.

### `PATCH /admin/curadoria/{tipo}/{id}`

Só admin. Registra a decisão da curadoria sobre um artesão (`tipo` `artesaos`) ou uma peça (`tipo` `pecas`) que está em análise. Resposta `204`, sem corpo.

```json
{ "decisao": "ajustes", "parecer": "Envie fotos com fundo neutro." }
```

| `decisao` | Novo status | `parecer` |
|---|---|---|
| `aprovar` | `publicado` | opcional; o `parecerCuradoria` do item é apagado |
| `ajustes` | `ajustesSolicitados` | obrigatório; fica em `parecerCuradoria` para o artesão ver |
| `recusar` | `recusado` | obrigatório; fica em `parecerCuradoria`. Peça recusada não pode mais ser editada |

- Cada decisão fica no histórico (tabela `AnaliseCuradoria`) e vira uma atividade do painel (ex.: "Maria Clara aprovou a peça “Céu de Agreste”").
- O cache da vitrine é zerado: aprovar ou recusar um artesão muda quais peças aparecem.
- Erros: `400 VALIDATION` (`tipo` ou `decisao` inválidos, ou ajustes/recusa sem `parecer`); `401 UNAUTHORIZED`; `403 FORBIDDEN`; `404 NOT_FOUND` (artesão ou peça não existe); `409 CONFLICT` (o item não está `emAnalise`).

## Autenticação e cadastro

O login grava um JWT num **cookie httpOnly** chamado `token`: o JavaScript do site não lê o token, o navegador envia o cookie sozinho em cada requisição. Para isso o `services/api.ts` usa `withCredentials: true`, e o backend libera no CORS só o endereço do frontend (`FRONTEND_URL`) com `credentials: true`.

- O token tem `{ id, perfil }` e vale **1 dia** (o cookie também).
- Cookie: `httpOnly`, `path=/`. Local: `sameSite=lax`. Produção (front na Vercel e backend no Render, domínios diferentes): `sameSite=none` e `secure`.
- Rotas protegidas respondem `401 UNAUTHORIZED` sem cookie ou com token inválido/expirado, e `403 FORBIDDEN` quando o perfil não tem acesso.

Todas as respostas de usuário usam o tipo `Usuario` (`frontend/src/types/usuario.ts`), **nunca com a senha**:

```json
{
  "id": "u1",
  "nome": "Ana Beatriz Souza",
  "email": "ana.beatriz@email.com",
  "perfil": "comprador",
  "status": "ativo",
  "cidade": "Recife/PE",
  "criadoEm": "2026-06-12T10:00:00.000Z"
}
```

### `POST /usuarios`

Cadastro de comprador (tela `/cadastro/comprador`). Sempre cria o perfil `comprador`; artesão e admin não se cadastram por aqui. Corpo (`CadastroCompradorInput`):

```json
{ "nome": "Ana Beatriz Souza", "email": "ana.beatriz@email.com", "senha": "minhasenha" }
```

Resposta `201` com o `Usuario` criado. O cadastro **não** faz login: a tela chama `POST /auth/login` em seguida, se quiser entrar direto. O e-mail é salvo em minúsculas e sem espaços nas pontas.

Erros:
- `400 VALIDATION`: sem nome, e-mail inválido ou senha com menos de 8 caracteres ou sem caractere especial (qualquer coisa que não seja letra, número ou espaço, ex.: `@`, `#`, `!`).
- `409 CONFLICT`: já existe uma conta com o e-mail.

### `POST /usuarios/artesao`

Cadastro de artesão (tela `/cadastro/artesao`). Numa transação, cria o `Usuario` (perfil `artesao`), o perfil de artesão com status `emAnalise` (vai para a fila de `GET /admin/curadoria`) e uma notificação "Novo artesão cadastrado" no painel do admin. Não faz login. Corpo (`CadastroArtesaoInput`):

```json
{
  "aceitouTermos": true, "nome": "Rosa Maria", "email": "rosa@email.com", "senha": "minhasenha", "telefone": "(81) 98888-0000",
  "nomeArtistico": "Rosa do Barro", "oficio": "Ceramista", "tempoAtuacao": "3-10", "categoria": "ceramica-barro",
  "tecnicas": ["Modelagem manual"], "cidade": "Tracunhaém", "estado": "PE", "regiao": "zona-da-mata",
  "historia": "Aprendi com minha mãe.", "trabalho": "", "origemTrabalho": "", "gostaDeFazer": "",
  "comprovacoes": { "possuiRegistro": true, "participouFeiras": false, "pertenceAssociacao": true, "associacao": "Associação X", "links": ["https://..."] }
}
```

- Resposta `201` com o `Usuario` criado. O nome público é `nomeArtistico` (ou `nome`, se vazio); a `bio` vem de `trabalho` (ou do começo de `historia`); a foto começa com uma imagem padrão (o envio de fotos ainda não existe).
- As `comprovacoes` aparecem no detalhe da curadoria.
- Erros: `400 VALIDATION` (termos não aceitos, nome, e-mail, senha com menos de 8 caracteres ou sem caractere especial, telefone sem DDD, ofício, área, cidade, estado, região ou história faltando, área ou região inexistente, mais de 3 links ou link sem `http(s)://`); `409 CONFLICT` (e-mail já cadastrado).

### `POST /auth/login`

```json
{ "email": "ana.beatriz@email.com", "senha": "minhasenha" }
```

Resposta `200` com o `Usuario` e o cabeçalho `Set-Cookie: token=...; HttpOnly`.

Erros:
- `400 VALIDATION`: sem e-mail ou sem senha.
- `401 UNAUTHORIZED`: e-mail ou senha incorretos (a mesma mensagem nos dois casos, para não revelar quais e-mails têm conta).
- `403 FORBIDDEN`: conta com `status` `suspenso`.

### `POST /auth/logout`

Sem corpo. Apaga o cookie e responde `204` (sem corpo). Funciona mesmo sem estar logado.

### `GET /auth/me`

Quem está logado, a partir do cookie. Como o token é httpOnly, é assim que o frontend descobre, ao abrir ou recarregar a página, se há sessão. Resposta `200` com o `Usuario`.

Erro: `401 UNAUTHORIZED` sem cookie, com token inválido ou expirado, ou se o usuário não existe mais.

## Rotas planejadas

Ainda não existem no código.

| Rota | Tela |
|---|---|
| carrinho salvo no backend | carrinho |
