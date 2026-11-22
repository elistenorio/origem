# Backend — Origem

Stack da disciplina: Node.js + TypeScript + Express 4 + Prisma 6 + PostgreSQL, JWT (`jsonwebtoken`) em cookie httpOnly, `bcryptjs`, `cors`, `cookie-parser`, `dotenv`, `swagger-ui-express` (Swagger em `/api/docs`). Nada além disso sem perguntar (Redis está previsto; processamento assíncrono ainda não foi decidido).

Prisma fica na versão 6: a 7 tira `url`/`directUrl` do `schema.prisma`, e o projeto usa o formato com `env("DATABASE_URL")` e `env("DIRECT_URL")`.

## Comandos (dentro de `backend/`)
- `docker compose up -d` — PostgreSQL (porta 5434) e Redis (porta 6380) locais
- `npm run dev` — API em http://localhost:3001/api
- `npm run build` — compila com `tsc`; rode antes de dar a tarefa por concluída
- `npm run prisma:migrate -- --name <nome>` — cria e aplica migration depois de mudar o `schema.prisma`
- `npm run prisma:seed` — apaga os dados e recarrega o seed (`prisma/seed.ts`, a partir de `prisma/data/db.json`)

## Estrutura
```
prisma/                      schema.prisma, seed.ts, migrations/, data/db.json (cópia do db.json da Fake API)
src/
  server.ts                  app Express: cors, json, cookie-parser, rotas em /api, 404 e errorHandler
  application/routes/        um <recurso>.routes.ts por recurso + index.ts (junta tudo)
  application/controllers/   HTTP: lê req, valida campos (400), chama o service, responde
  application/docs/          openapi.ts: documentação do Swagger, escrita a partir do docs/api.md
  infrastructure/services/   regras de negócio; lançam AppError
  infrastructure/repositories/ acesso ao banco via Prisma, sem regra de negócio
  infrastructure/prisma/     instância única do PrismaClient
  middleware/                authMiddleware, roleMiddleware, errorHandler
  shared/                    env, AppError, jwt, cookie, validacao
  @types/express.d.ts        tipo de req.user ({ id, perfil })
```

## Fluxo e regras
- route → controller → service → repository. Controller não usa Prisma; repository não tem regra de negócio.
- Controllers: `try/catch` com `next(err)`. Erros esperados são `new AppError(status, code, message)`; o `errorHandler` (4 parâmetros) responde `{ error: { code, message } }`. Erro desconhecido vira `500 INTERNAL` sem expor detalhes.
- Códigos: `VALIDATION` 400, `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT`/`OUT_OF_STOCK` 409, `INTERNAL` 500.
- **Contrato:** rotas, parâmetros e formatos de resposta e de erro iguais aos de `docs/api.md` e aos tipos de `frontend/src/types/`, para o frontend não mudar. Mudou ou criou rota: atualize o `docs/api.md` e o `application/docs/openapi.ts` (Swagger).
- Ids são texto (os do seed mantêm os do `db.json`: `p1`, `a1`, `u1`). Campos derivados (ex.: `artesaoNome` e `cidade` do produto) são montados no repository a partir das relações.
- Tipos do contrato (`Produto`, `Artesao`, `Paginated`...) ficam em `src/shared/types/`, iguais aos de `frontend/src/types/`. Paginação com `readPagination`/`paginated` de `src/shared/pagination.ts`.
- Busca sem acento: SQL com `unaccent` via `prisma.$queryRaw` (template com `${...}`, nunca concatenando texto), que devolve só os ids; filtros, ordem e paginação continuam no Prisma. Nunca use `$queryRawUnsafe`.
- Cache (Redis, `src/infrastructure/cache/`): `GET /produtos` e `GET /produtos/:id` passam por `produtosCache.comCache`. **Toda mudança em peça (estoque, status, dados, artesão) precisa chamar `produtosCache.invalidar()` no service, depois de gravar.** O cache é opcional: sem `REDIS_URL` ou com o Redis fora do ar, a API segue sem ele.
- Respostas de usuário nunca incluem `senhaHash` (use o `select` público do repository).
- Rotas protegidas: `authMiddleware` (cookie `token` → `req.user`) e, se for por perfil, `roleMiddleware(["artesao"])` depois dele. Recurso de outro usuário: filtrar por `req.user.id`; acesso indevido (sem ser admin) → 403.
- CORS só com `FRONTEND_URL` e `credentials: true`; nunca `"*"`.
- Variáveis novas: adicionar em `shared/env.ts` e no `.env.example` (sem valores reais).

## Idioma
Segue o `CLAUDE.md` da raiz: domínio em português sem acento (`usuarios.service.ts`, `cadastrarComprador`, `artesaoId`), técnico em inglês (`authMiddleware`, `errorHandler`, `AppError`, códigos de erro). Comentários e mensagens de erro em português.
