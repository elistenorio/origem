# Origem

## Descrição
**Origem** é uma aplicação web full stack que conecta artesãos e produtores criativos a compradores. A plataforma inclui vitrine do comprador (busca, filtros, perfil do artesão, carrinho, avaliações), painel do artesão (catálogo, estoque, pedidos), painel administrativo e indicadores de venda.

Projeto Integrador 2026.2 (CESAR School), disciplina de Desenvolvimento Web. Branch principal: `main`.

**Fase atual — Avaliação 2:** backend real (Node.js + Express + Prisma + PostgreSQL) substituindo a Fake API da Avaliação 1, com autenticação JWT em cookie. Em construção: já existem a estrutura base, o banco (schema e seed), o login/cadastro, a vitrine, os pedidos e Minha conta.

## Problema de Negócio

Artesãos e produtores criativos têm pouca visibilidade digital, dependem de intermediários e enfrentam gestão precária de catálogo, pedidos e estoque. O Origem cria um canal direto entre essa produção e os compradores, destacando origem, técnica e o impacto de comprar de quem faz.

## Integrantes
- Aguinaldo Anselmo da Costa Neto
- Caliel Feijó de Melo Silva
- Elis Maidi Tenório Chaprão
- Eulália Regina Silva de Albuquerque
- Giulia Marianna Ferreira
- Sarah Cyrne Ferreira

## Tecnologias utilizadas

**Frontend (Avaliação 1)**
- [Next.js 16](https://nextjs.org) (App Router) com React 19 e React Compiler
- TypeScript
- [Chakra UI v3](https://chakra-ui.com): componentes, tema, recipes e tokens de cor do Origem (`frontend/src/theme`)
- [Zustand](https://zustand.docs.pmnd.rs): estado global no navegador (ex.: preferências de cookies)
- React Icons
- ESLint
- Tailwind CSS (instalado pela stack da disciplina; os estilos das telas são feitos com Chakra UI)

**Backend (Avaliação 2, em `backend/`)**
- Node.js + Express + TypeScript
- [Prisma](https://www.prisma.io) com PostgreSQL (Docker no ambiente local; Supabase em produção)
- Autenticação com JWT (`jsonwebtoken`) em cookie httpOnly, senhas com `bcryptjs`
- `cors` e `cookie-parser`
- Cache com [Redis](https://redis.io) (`redis`) em `GET /produtos` e `GET /produtos/:id`: Docker no ambiente local; Key Value do Render em produção

## Como executar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 20.9 ou mais recente (recomendado: versão LTS) e Git.

```bash
git clone https://github.com/elistenorio/origem.git
cd origem/frontend
npm install
npm run dev
```

Acesse http://localhost:3000.

Outros comandos (dentro de `frontend/`):

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (gera os tipos do tema antes, via `prebuild`) |
| `npm run start` | Roda o build de produção |
| `npm run lint` | Verifica o código com ESLint |
| `npm run typegen` | Regenera os tipos do tema do Chakra (rodar depois de mudar `src/theme/`) |

### Backend

Pré-requisitos: Node.js e [Docker](https://www.docker.com) (para o PostgreSQL local).

```bash
cd origem/backend
npm install
cp .env.example .env          # preencha (veja "Variáveis de ambiente")
docker compose up -d          # PostgreSQL (porta 5434) e Redis (porta 6380)
npm run prisma:migrate        # cria as tabelas
npm run prisma:seed           # carrega os dados de exemplo
npm run dev                   # API em http://localhost:3001/api
```

Para o frontend usar o backend, defina `NEXT_PUBLIC_API_URL=http://localhost:3001/api` em `frontend/.env.local`.

Contas criadas pelo seed (senha de todas: `Origem@123`, só para desenvolvimento):

| Perfil | E-mail |
|---|---|
| Comprador | `ana.beatriz@email.com` (também `pedro.h@`, `luana.souza@`, `julia.rocha@email.com`) |
| Comprador suspenso | `joao.silva@email.com` (login recusado) |
| Artesão | `joaozinho@email.com` (um usuário por artesão, com o e-mail do perfil) |
| Administrador | `admin@origem.com` |

Outros comandos (dentro de `backend/`):

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (reinicia ao salvar) |
| `npm run build` / `npm run start` | Compila para `dist/` e roda o build |
| `npm run prisma:migrate` | Cria/aplica migrations no banco local |
| `npm run prisma:deploy` | Aplica as migrations em produção |
| `npm run prisma:seed` | Apaga os dados e recarrega o seed |
| `npm run prisma:studio` | Interface para ver o banco |

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Não | Endereço base da API. Se não for definida, o frontend usa `/api` (a Fake API do próprio Next). Na Avaliação 2 aponta para o backend real. |

Modelo em [`frontend/.env.example`](frontend/.env.example). Para usar, copie para `frontend/.env.local`. Nunca coloque credenciais reais no `.env.example`.

**Backend** (modelo em [`backend/.env.example`](backend/.env.example), copiar para `backend/.env`):

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | Conexão do app com o PostgreSQL. No Supabase: pooler, porta 6543, com `?pgbouncer=true` |
| `DIRECT_URL` | Sim | Conexão direta usada pelas migrations. No Supabase: porta 5432. Local: igual à `DATABASE_URL` |
| `JWT_SECRET` | Sim | Segredo para assinar os tokens |
| `FRONTEND_URL` | Sim | Endereço exato do frontend, liberado no CORS (local: `http://localhost:3000`) |
| `PORT` | Não | Porta da API (padrão 3001) |
| `NODE_ENV` | Não | `production` no Render: o cookie passa a ir com `secure` e `sameSite=none` |
| `REDIS_URL` | Não | Redis do cache (local: `redis://localhost:6380`). Vazia = API sem cache |

## Funcionalidades implementadas

Telas implementadas com dados de exemplo; a integração com a Fake API está em andamento.

**Comprador**
- Vitrine (home) com peças e artesãos em destaque
- Catálogo com busca e filtros (categoria, técnica, material, região, preço, disponibilidade) e ordenação
- Detalhe do produto e perfil do artesão com suas peças
- Carrinho (alterar quantidade, remover, calcular frete) e checkout com simulação de compra
- Meus pedidos (acompanhar, cancelar e avaliar) e Minha conta
- Login e cadastro de comprador ligados ao backend (JWT em cookie): o cabeçalho mostra quem está logado, "Sair" encerra a sessão e as áreas do comprador (`/minha-conta`, `/pedidos`), do artesão (`/artesao/*`) e do admin (`/admin/*`) pedem login com o perfil certo. O cadastro de artesão ainda é só a tela, sem API

**Artesão**
- Dashboard, meu perfil, meu catálogo (adicionar, editar e ocultar peças) e estoque

**Administrador**
- Início, gestão da plataforma, curadoria, acompanhamento, indicadores e visão geral

**Institucional e ajuda**
- Sobre, newsletter, páginas de ajuda (como comprar, entregas e frete, formas de pagamento, trocas e devoluções, perguntas frequentes), termos de uso, política de privacidade e política de cookies

## Rotas da API
Endpoints, métodos, parâmetros, exemplos de resposta e erros em [`docs/api.md`](docs/api.md). A Fake API (Route Handlers do Next em `frontend/src/app/api`) é substituída aos poucos pelo backend em `backend/`, com as mesmas rotas; no backend já existem cadastro (`POST /usuarios`), autenticação (`/auth/login`, `/auth/logout`, `/auth/me`) as rotas da vitrine (`/produtos`, `/produtos/{id}`, `/produtos/{id}/relacionados`, `/filtros`, `/artesaos`, `/artesaos/{id}` e `/frete`), de pedidos (`POST /pedidos`, `PATCH /pedidos/{id}`, `POST /avaliacoes`) de Minha conta (`/minha-conta` e sub-rotas) e o painel do admin (`GET /admin/painel`): todas as rotas da Fake API já existem no backend.

## Deploy
Banco no Supabase, backend no Render (`render.yaml`) e frontend na Vercel. Passo a passo em [`docs/deploy.md`](docs/deploy.md).

- Site: _a definir_
- API: _a definir_

## Evidências
- Declaração de uso de IA: [`docs/uso-de-ia.md`](docs/uso-de-ia.md)
- Prints e vídeo do fluxo no ambiente publicado: _a incluir após o deploy_
