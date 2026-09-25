# API do Origem

## Visão geral

| | Avaliação 1 (agora) | Avaliação 2 |
|---|---|---|
| Quem responde | **Fake API**: Route Handlers do Next.js em `frontend/src/app/api/` | Backend Node.js + Express + Prisma |
| URL base | `/api` (mesmo endereço do site) | valor de `NEXT_PUBLIC_API_URL` |
| Dados | `frontend/src/mocks/db.json`, lido em memória | banco de dados |

- Toda resposta tem um atraso simulado de **300 ms**, para as telas mostrarem o estado de carregamento.
- As rotas que gravam (`POST`) alteram os dados **só em memória**: valem até o servidor reiniciar. Na Vercel, cada chamada pode cair numa instância diferente, então a tela usa a própria resposta do `POST` (ex.: a confirmação do pedido).
- Sem login na Avaliação 1: as rotas de `/minha-conta` usam usuários de demonstração (compradora Ana Beatriz, `u1`).
- As fotos são provisórias (Unsplash e picsum.photos).
- Nomes: o que é do domínio fica em português (`/produtos`, `titulo`, `preco`); o formato técnico de paginação e de erro fica em inglês (`items`, `page`, `error`).

### Onde está o código

| Pasta | Papel |
|---|---|
| `frontend/src/mocks/db.json` | os dados: cada lista é uma "tabela" (produtos, artesaos, usuarios, pedidos...) |
| `frontend/src/mocks/db.ts` | importa o `db.json` com os tipos de `src/types` |
| `frontend/src/app/api/<rota>/route.ts` | as rotas: leem o `db`, filtram e respondem |
| `frontend/src/app/api/_lib/` | apoio às rotas: `responses.ts` (sucesso, erro e atraso), `pagination.ts`, `session.ts` (usuários de demonstração) |
| `frontend/src/types/` | o contrato: formato de cada entidade e resposta |
| `frontend/src/services/` | as funções que as telas usam para chamar a API; `api.ts` tem a instância do axios usada por todos |

Fluxo: tela → hook `useApi` → service → `api` (axios) → `/api/...` → `db.json`.

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
| 404 | `NOT_FOUND` | o recurso não existe ou não está publicado |
| 409 | `OUT_OF_STOCK` | quantidade pedida maior que o estoque |
| 409 | `CONFLICT` | ação não permitida no estado atual (ex.: avaliar um pedido duas vezes) |

O `services/api.ts` transforma essa resposta em um `ApiError` (com `code`, `message` e `status`), e a tela mostra a `message`. Sem resposta do servidor, o erro vira `NETWORK` (status 0).

## Rotas implementadas

### `GET /produtos`

Vitrine: catálogo, destaques da home e peças de um artesão. Só aparecem peças com `status` `publicado`.

| Parâmetro | Valores | Observação |
|---|---|---|
| `busca` | texto | procura em título, artesão, cidade, categoria, técnica, material e tags; ignora acentos e maiúsculas (`ceramica` acha "Cerâmica") |
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

Esta é a **recomendação simulada** da Avaliação 1. Na Avaliação 2, o módulo de recomendação assume esta rota, com o mesmo endereço e o mesmo formato de resposta.

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

Na Avaliação 1 as listas vêm de `frontend/src/constants/`; na Avaliação 2 viram tabelas do banco.

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
- `400 VALIDATION`: sem peças, sem nome ou e-mail do comprador, sem CEP, sem frete ou sem forma de pagamento.
- `404 NOT_FOUND`: uma das peças não existe ou não está mais publicada.
- `409 OUT_OF_STOCK`: quantidade maior que o estoque da peça.

Os dados do cartão não são enviados na Avaliação 1.

### `GET /minha-conta`

Dados da compradora logada (na Avaliação 1, a de demonstração): os campos de `Usuario` mais CPF mascarado, telefone, endereço e formas de pagamento.

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

### `GET /minha-conta/pedidos`

"Meus pedidos": lista de `Pedido` da compradora logada (pelo e-mail), do mais recente para o mais antigo. Sem paginação. Pedidos criados em `POST /pedidos` com o mesmo e-mail aparecem aqui enquanto o servidor não reiniciar.

### `POST /avaliacoes`

Avaliação de um pedido entregue ("Avaliar o pedido" em Meus pedidos).

```json
{ "pedidoId": "10402", "nota": 5, "comentario": "Peça linda!", "notas": { "produto": 5, "embalagem": 4 } }
```

Resposta `201` com a `Avaliacao` (os mesmos campos, mais `id` e `criadoEm`). O pedido passa a ter `avaliado: true`.

Erros:
- `400 VALIDATION`: nota fora de 1 a 5.
- `404 NOT_FOUND`: o pedido não existe.
- `409 CONFLICT`: o pedido não foi entregue ou já foi avaliado.

## Rotas planejadas

Ainda não existem no código. Os dados de que elas precisam já estão no `db.json`.

| Fase | Rota | Tela |
|---|---|---|
| Artesão | `GET /minha-conta/produtos` | catálogo e estoque do artesão (todas as peças, em qualquer status) |
| Artesão | `GET /minha-conta/resumo` | números do painel do artesão |
| Artesão | `PATCH /minha-conta/produtos/{id}` | editar estoque |
| Admin | `GET /admin/painel` | início do admin |
| Admin | `GET /admin/indicadores?periodo=` | indicadores e visão geral |
| Admin | `GET /admin/acompanhamento` | acompanhamento |
| Admin | `GET /admin/curadoria?tipo=` | curadoria |
| Depois | `PATCH /pedidos/{id}`, `POST /usuarios`, criar e editar peça, gestão do admin | cancelar pedido, cadastro, formulário de peça, tabelas de gestão |

Na Avaliação 2 entram também login e cadastro reais (JWT), carrinho salvo no backend e as rotas protegidas por perfil.

## Como a Fake API será substituída pelo backend

1. O backend implementa as mesmas rotas deste documento, com os mesmos parâmetros e os mesmos formatos de resposta e de erro.
2. O `db.json` vira o seed do banco (Prisma). As listas de `constants/` (categorias, técnicas, materiais, regiões) viram tabelas.
3. As rotas de `/minha-conta` passam a identificar o usuário pelo login (JWT em cookie) em vez de `_lib/session.ts`.
4. No frontend, basta definir `NEXT_PUBLIC_API_URL` com o endereço do backend. O `services/api.ts` já usa essa variável; services, hooks e telas não mudam.
5. As pastas `frontend/src/app/api/` e `frontend/src/mocks/` são apagadas.
