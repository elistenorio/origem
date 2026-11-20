# API do Origem

## Visão geral

| | Avaliação 1 (agora) | Avaliação 2 |
|---|---|---|
| Quem responde | **Fake API**: Route Handlers do Next.js em `frontend/src/app/api/` | Backend Node.js + Express + Prisma |
| URL base | `/api` (mesmo endereço do site) | valor de `NEXT_PUBLIC_API_URL` |
| Dados | `frontend/src/mocks/db.json`, lido em memória | PostgreSQL (o seed vem do mesmo `db.json`) |
| Código | `frontend/src/app/api/` | `backend/` (rotas em `backend/src/application/routes`) |

**Andamento da Avaliação 2:** o backend já tem cadastro e autenticação (seção "Autenticação e cadastro", no fim das rotas), as rotas da vitrine (`GET /produtos`, `/produtos/{id}`, `/produtos/{id}/relacionados`, `/filtros`, `/artesaos`, `/artesaos/{id}` e `/frete`), as de pedidos (`POST /pedidos`, `PATCH /pedidos/{id}`, `POST /avaliacoes`) as de Minha conta (`GET /minha-conta`, `/minha-conta/pedidos`, `/minha-conta/produtos`, `/minha-conta/resumo` e `PATCH /minha-conta/produtos/{id}`) e `GET /admin/painel`, com as mesmas respostas da Fake API (diferenças em "Diferenças do backend", abaixo). Com isso, **todas as rotas da Fake API já existem no backend**.

### Diferenças do backend

- Datas vêm com milissegundos (`"2026-09-20T10:00:00.000Z"` em vez de `"2026-09-20T10:00:00Z"`). É o mesmo instante, no mesmo formato ISO 8601.
- `totalProdutos` do artesão é **contado no banco** (peças publicadas). No `db.json` era um número fixo.
- `pageSize` tem máximo de 100: um valor maior vira 100.
- **Cache (Redis)** em `GET /produtos` e `GET /produtos/{id}`: a resposta traz o cabeçalho `X-Cache: HIT` (veio do cache) ou `MISS` (veio do banco). Cada resposta fica guardada por até 5 minutos, e o cache é zerado na hora em que uma peça muda (compra, cancelamento, estoque ou visibilidade alterados pelo artesão). Sem Redis, as rotas funcionam igual, sempre com `MISS`.
- Ordem `relevancia` (padrão): no backend vem da coluna `relevancia`, que o seed preenche na ordem do `db.json`. Peças e artesãos novos entram no fim.
- **Login de verdade:** as rotas de `/minha-conta` identificam o usuário pelo cookie (sem login → `401`); `/minha-conta/produtos`, `/minha-conta/resumo` e `PATCH /minha-conta/produtos/{id}` são só do perfil `artesao` (outro perfil → `403`). `PATCH /pedidos/{id}` e `POST /avaliacoes` também exigem login e só o dono do pedido pode usá-las (o admin também pode cancelar); pedido de outra pessoa → `403`.
- **Pedidos de verdade:** `POST /pedidos` baixa o estoque e o cancelamento devolve as peças. O frete é recalculado pelo CEP (do `frete` enviado, só vale a `modalidade`). O número do pedido vem de uma sequência do banco (`10496`, `10497`...).

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
| 401 | `UNAUTHORIZED` | sem login, sessão inválida ou expirada, ou e-mail/senha incorretos (só backend) |
| 403 | `FORBIDDEN` | logado, mas sem permissão: perfil errado, recurso de outro usuário ou conta suspensa (só backend) |
| 404 | `NOT_FOUND` | o recurso não existe ou não está publicado |
| 409 | `OUT_OF_STOCK` | quantidade pedida maior que o estoque |
| 409 | `CONFLICT` | ação não permitida no estado atual (ex.: avaliar um pedido duas vezes, e-mail já cadastrado) |
| 500 | `INTERNAL` | erro inesperado no servidor (só backend) |

O `services/api.ts` transforma essa resposta em um `ApiError` (com `code`, `message` e `status`), e a tela mostra a `message`. Sem resposta do servidor, o erro vira `NETWORK` (status 0).

## Rotas implementadas

### `GET /produtos`

Vitrine: catálogo, destaques da home e peças de um artesão. Só aparecem peças com `status` `publicado`.

| Parâmetro | Valores | Observação |
|---|---|---|
| `busca` | texto | procura em título, artesão, cidade, categoria, técnica, material e tags; ignora acentos e maiúsculas (`ceramica` acha "Cerâmica"). No backend, usa a extensão `unaccent` do PostgreSQL |
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

Na Fake API as listas vêm de `frontend/src/constants/`; no backend vêm das tabelas `Categoria`, `Tecnica`, `Material` e `Regiao`, na mesma ordem (coluna `ordem`).

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

No backend:
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
- `400 VALIDATION`: sem peças, sem nome ou e-mail do comprador, sem CEP, sem frete ou sem forma de pagamento. No backend também: quantidade que não é inteiro de pelo menos 1, e-mail inválido, CEP sem 8 números, modalidade de frete ou forma de pagamento desconhecida, parcelas fora de 1 a 12.
- `404 NOT_FOUND`: uma das peças não existe ou não está mais publicada.
- `409 OUT_OF_STOCK`: quantidade maior que o estoque da peça.

Os dados do cartão não são enviados na Avaliação 1.

### `GET /minha-conta`

Dados da compradora logada (na Avaliação 1, a de demonstração): os campos de `Usuario` mais CPF mascarado, telefone, endereço e formas de pagamento. No backend vale para qualquer perfil logado (sem login → `401`); campos ainda não preenchidos voltam vazios (`""`, endereço com campos vazios e `formasPagamento: []`).

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

Na tela, a lista também mostra os pedidos finalizados **neste navegador** (`store/ordersStore.ts`, salvo no localStorage). Assim o pedido recém-criado aparece mesmo no deploy, onde a próxima requisição pode cair noutra instância do servidor, e com qualquer e-mail. Na Avaliação 2 o backend salva o pedido de verdade e esse store sai.

No backend, a lista traz os pedidos **ligados à conta logada** (feitos com login), não os feitos como visitante com o mesmo e-mail. Erro: `401 UNAUTHORIZED` sem login.

### `POST /avaliacoes`

Avaliação de um pedido entregue ("Avaliar o pedido" em Meus pedidos).

```json
{ "pedidoId": "10402", "nota": 5, "comentario": "Peça linda!", "notas": { "produto": 5, "embalagem": 4 } }
```

Resposta `201` com a `Avaliacao` (os mesmos campos, mais `id` e `criadoEm`). O pedido passa a ter `avaliado: true`.

Erros:
- `400 VALIDATION`: nota fora de 1 a 5 (no backend, também as notas de `notas`, quando enviadas).
- `401 UNAUTHORIZED` (backend): sem login.
- `403 FORBIDDEN` (backend): o pedido não é de quem está logado.
- `404 NOT_FOUND`: o pedido não existe.
- `409 CONFLICT`: o pedido não foi entregue ou já foi avaliado.

### `PATCH /pedidos/{id}`

Atualiza o pedido ("Cancelar o pedido" em Meus pedidos). Na Avaliação 1 a única mudança permitida é cancelar, e só antes do envio (`processando` ou `emSeparacao`). Exemplo: `PATCH /api/pedidos/10495`

```json
{ "status": "cancelado", "motivo": "Comprei por engano", "observacao": "opcional" }
```

Resposta `200` com o `Pedido` atualizado: `status` `cancelado`, `motivoCancelamento` preenchido e um evento "Pedido cancelado" no fim de `eventos`.

Erros:
- `400 VALIDATION`: `status` diferente de `cancelado` ou sem `motivo`.
- `401 UNAUTHORIZED` (backend): sem login.
- `403 FORBIDDEN` (backend): o pedido não é de quem está logado (o admin pode cancelar qualquer um).
- `404 NOT_FOUND`: o pedido não existe.
- `409 CONFLICT`: o pedido já foi enviado, entregue ou cancelado.

No backend, cancelar devolve as peças do pedido ao estoque.

### `GET /minha-conta/produtos`

"Meu catálogo" e "Estoque" do artesão logado (na Avaliação 1, o de demonstração: Mestre Joãozinho, `a1`). Lista de `Produto` com **todas** as peças dele, em qualquer `status` (publicada, em análise, rascunho, indisponível), das mais recentes para as mais antigas. Sem paginação e sem filtros: busca, filtros e ordem são feitos na tela.

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
- `400 VALIDATION`: nenhum campo enviado, estoque negativo ou não inteiro, ou status diferente de `publicado`/`indisponivel`.
- `401 UNAUTHORIZED` / `403 FORBIDDEN` (backend): sem login / perfil diferente de `artesao` (vale também para `GET /minha-conta/produtos` e `/minha-conta/resumo`).
- `404 NOT_FOUND`: a peça não existe ou não é do artesão logado.
- `409 CONFLICT`: tentar esconder ou mostrar uma peça que ainda não foi publicada (rascunho ou em análise).

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

- `pedidosHoje`, `vendasMes` e `clientes` são números fixos do `db.json` (`resumoPlataforma`); `artesaosAtivos`, `produtosPublicados` e as `pendencias` são contados a partir dos dados.
- Sem login na Avaliação 1; na Avaliação 2 a rota fica protegida para o perfil `admin`.

No backend:
- Exige login (`401`) e perfil `admin` (`403`).
- **Todos os números do `resumo` são contados no banco**: `pedidosHoje` (pedidos criados desde 0h), `vendasMes` (soma do `total` dos pedidos não cancelados do mês), `clientes` (usuários com perfil `comprador`), `artesaosAtivos` e `produtosPublicados`. "Hoje" e "mês" seguem o horário de Recife.
- `pendencias`: artesãos e peças com status `emAnalise`, e pedidos `processando` ou `emSeparacao`. (Na Fake API, "artesãos aguardando curadoria" contava a lista `curadoria` do `db.json`, que incluía uma artesã já publicada; por isso o número pode ser menor.)
- `notificacoes` e `atividades`: tabelas `Notificacao` e `Atividade`, preenchidas pelo seed com o conteúdo do `db.json`, das mais recentes para as mais antigas (até 10 de cada). Ainda não há ação no sistema que crie novas; isso vem com a curadoria e a gestão.

## Autenticação e cadastro (backend)

Existem **só no backend** (`backend/`), não na Fake API. O login grava um JWT num **cookie httpOnly** chamado `token`: o JavaScript do site não lê o token, o navegador envia o cookie sozinho em cada requisição. Para isso o `services/api.ts` usa `withCredentials: true`, e o backend libera no CORS só o endereço do frontend (`FRONTEND_URL`) com `credentials: true`.

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
- `400 VALIDATION`: sem nome, e-mail inválido ou senha com menos de 8 caracteres.
- `409 CONFLICT`: já existe uma conta com o e-mail.

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

Ainda não existem no código. Os dados de que elas precisam já estão no `db.json`.

| Fase | Rota | Tela |
|---|---|---|
| Admin | `GET /admin/indicadores?periodo=` | indicadores e visão geral |
| Admin | `GET /admin/acompanhamento` | acompanhamento |
| Admin | `GET /admin/curadoria?tipo=` | curadoria |
| Depois | criar e editar peça, gestão do admin | formulário de peça, tabelas de gestão |

Na Avaliação 2 entram também o carrinho salvo no backend e as rotas protegidas por perfil.

## Como a Fake API será substituída pelo backend

1. O backend implementa as mesmas rotas deste documento, com os mesmos parâmetros e os mesmos formatos de resposta e de erro.
2. O `db.json` vira o seed do banco (Prisma). As listas de `constants/` (categorias, técnicas, materiais, regiões) viram tabelas.
3. As rotas de `/minha-conta` passam a identificar o usuário pelo login (JWT em cookie) em vez de `_lib/session.ts`.
4. No frontend, basta definir `NEXT_PUBLIC_API_URL` com o endereço do backend. O `services/api.ts` já usa essa variável; services, hooks e telas não mudam.
5. As pastas `frontend/src/app/api/` e `frontend/src/mocks/` são apagadas.
