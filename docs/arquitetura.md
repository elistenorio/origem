# Arquitetura do frontend

Este documento descreve como o frontend do Origem está organizado na Avaliação 1 e como ele passa a consumir a Fake API e, na Avaliação 2, o backend real, sem reescrever as telas.

## Visão geral

```
origem/
├── frontend/   aplicação Next.js (Avaliação 1)
└── docs/       documentação (API, arquitetura, fluxos, uso de IA)
```

O backend (Node + Express + Prisma + JWT) entra na Avaliação 2, numa pasta `backend/` própria.

**Stack do frontend:** Next.js 16 (App Router), React 19, TypeScript, Chakra UI v3 e Zustand.

## Organização de `frontend/src/`

| Pasta | Responsabilidade |
|---|---|
| `app/` | Rotas. URLs em português (`/catalogo`, `/carrinho`, `/pedidos`...). Grupos `(main)` (telas com cabeçalho e rodapé) e `(auth)` (login e cadastro, com layout próprio). |
| `components/<assunto>/` | Componentes por domínio: `inicio`, `catalogo`, `carrinho`, `checkout`, `pedidos`, `conta`, `artesao`, `artesaos`, `admin`, `ajuda`, `institucional`, `cadastro`, `autenticacao`. |
| `components/common/` | Peças reutilizáveis em várias telas: campos de formulário, `SectionCard`, `Tile`, `Price`, `QuantityStepper`, `StatusBadge`, `StarRating`, `OrigemDialog`, `PaginationBar`, `Banner`. |
| `components/layout/` | Estrutura das páginas: `Header`, `Footer`, `PageContainer` (largura e margens) e `PageHeader` (breadcrumb, título e subtítulo). |
| `components/feedback/` | Estados de carregamento, erro e vazio: `LoadingState`, `ErrorState`, `EmptyMessage` e `DataState`, que escolhe qual mostrar. |
| `services/` | Única camada que faz requisições. `http.ts` centraliza o `fetch`. |
| `types/` | Formatos compartilhados das respostas da API (`api.ts`). |
| `dados-exemplo/` | Dados sintéticos usados pelas telas enquanto a Fake API é integrada (ver abaixo). |
| `hooks/` | Lógica reutilizável. Hoje: `useUrlFilters`, que guarda os filtros de listagem na URL. |
| `store/` | Estado global com Zustand. Hoje: `cookiePreferencesStore`. |
| `constants/` | Valores fixos do domínio: categorias, técnicas, materiais, regiões e opções de pedido. |
| `utils/` | Funções auxiliares: `formatCurrency`, `formatDate`, `normalizeText`, `validateCheckout`. |
| `theme/` | Tema do Chakra: tokens de cor, textStyles (`system.ts`) e recipes dos componentes (`recipes/`). |

## Regras de organização

- **`page.tsx` só monta a tela.** A tela em si fica num componente (ex.: `app/(main)/catalogo/page.tsx` renderiza `CatalogView`). Dados, regras e requisições não ficam no `page.tsx`.
- **Componentes pequenos e tipados.** Uma estrutura que se repete em duas telas vira componente.
- **Estilo pelo tema.** Cores, fontes, bordas, fundos e hover ficam nas recipes (`theme/recipes/`) e nos textStyles (`theme/system.ts`), aplicados por `variant` e `textStyle`. Inline ficam só medidas e alinhamento (`w`, `p`, `gap`, `align`...).
- **Responsivo desde o início**, com as props responsivas do Chakra (`{ base: ..., md: ... }`).
- **Idioma dos nomes:** o que é do domínio fica em português sem acento (`Produto`, `preco`, `artesaoId`, `filtrarProdutos`); o que é técnico fica em inglês (`Paginated`, `ApiError`, `http.ts`, `ProductCard`).

## Camada de dados

### Contrato das respostas (`types/api.ts`)

Todas as respostas da API, fake ou real, seguem os mesmos formatos:

```ts
// listas paginadas
type Paginated<T> = { items: T[]; page: number; pageSize: number; total: number }

// erros (status 4xx/5xx)
type ApiErrorBody = { error: { code: string; message: string } }  // ex.: code "NOT_FOUND"
```

### Cliente HTTP (`services/http.ts`)

`http<T>(path, { query, body })` monta a URL a partir de uma base configurável, envia JSON e converte qualquer falha em `ApiError` (`code`, `message`, `status`). Isso vale também para quando o servidor está fora do ar: nesse caso o código é `NETWORK`. As telas mostram `error.message` no `ErrorState`.

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api"
```

### Situação atual: `dados-exemplo/`

Enquanto a Fake API está sendo construída, as telas leem dados sintéticos de `src/dados-exemplo/`:

- `produtos.ts`, `artesaos.ts`, `pedidos.ts`, `usuarios.ts`, `admin.ts`: os dados;
- `tipos.ts`: os tipos das entidades (`Produto`, `Artesao`, `Pedido`...);
- `consultas.ts`: as funções que as telas chamam (`filtrarProdutos`, `buscarProduto`, `filtrarArtesaos`, `meusPedidos`, `opcoesFrete`...). Elas já devolvem os mesmos formatos da API, como `Paginated<T>` nas listas.

Cada função de `consultas.ts` corresponde a uma chamada futura de service. Por isso a troca não muda o formato dos dados que as telas recebem.

## Integração: dos dados de exemplo ao backend real

O fluxo final de dados é:

```
Componente → hook → service → http() → /api/* (Fake API) → mocks
                                   └──→ backend real (Avaliação 2)
```

**Avaliação 1: Fake API**
1. As rotas da Fake API ficam em `src/app/api/` (Route Handlers do Next) e leem os dados de `src/mocks/`. São documentadas em [`docs/api.md`](api.md).
2. Cada recurso ganha um service (`services/produtos.service.ts`...) que chama `http()`. Só os services fazem requisições.
3. Hooks de domínio (`useProdutos`...) chamam os services e expõem `loading`, `error` e os dados. As telas usam o `DataState` para os três estados.
4. As telas trocam as importações de `@/dados-exemplo/...` pelos hooks, e a pasta `dados-exemplo/` é apagada.
5. O carrinho passa a ser um store Zustand com `persist` (localStorage), compartilhado entre carrinho, checkout e cabeçalho.

**Avaliação 2: backend real**
1. O backend implementa as mesmas rotas e os mesmos formatos (`Paginated<T>`, `{ error: { code, message } }`).
2. Basta definir `NEXT_PUBLIC_API_URL` apontando para ele. Services, hooks e componentes não mudam.
3. O que depende de dados salvos de verdade (login, cadastro, carrinho no servidor, painel do artesão) passa a usar novos services seguindo o mesmo padrão.
