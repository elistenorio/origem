# Deploy do Origem

| Parte | Onde | Configuração no repositório |
|---|---|---|
| Banco PostgreSQL | Supabase | migrations em `backend/prisma/migrations/` |
| Backend (API) | Render | `render.yaml` (raiz) e o script `render-build` de `backend/package.json` |
| Cache (Redis) | Render (Key Value `origem-cache`) | `render.yaml`; o backend recebe a `REDIS_URL` sozinho |
| Frontend | Vercel | pasta `frontend/`, variável `NEXT_PUBLIC_API_URL` |

Os três usam Node 22 (`"engines"` nos `package.json`). Com Node 24, o `typegen` do Chakra falha e o build do front quebra.

## Ordem

### 1. Código na `main`

O Render e a Vercel publicam a branch `main`. Antes, junte as branches do backend na `main` (pull request).

### 2. Banco no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com), região **South America (São Paulo)**. Use uma senha do banco **só com letras e números**: símbolos (`@`, `#`, `/`...) quebram a URL de conexão.
2. No projeto, clique em **Connect** e copie duas URLs, trocando `[YOUR-PASSWORD]` pela senha:
   - **Transaction pooler** (porta **6543**): vai na `DATABASE_URL`, com `?pgbouncer=true` no fim.
   - **Session pooler** (porta **5432**): vai na `DIRECT_URL`. Não use a "Direct connection": no plano gratuito ela só funciona por IPv6, e o Render não tem IPv6.

```
DATABASE_URL=postgresql://postgres.<ref>:<senha>@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.<ref>:<senha>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

As tabelas são criadas pelo Render no passo 3 (`prisma migrate deploy`).

### 3. Backend no Render

1. Em [render.com](https://render.com): **New → Blueprint**, escolha o repositório. O Render lê o `render.yaml` e cria o serviço `origem-backend`.
2. Preencha as variáveis que ele pede:
   - `DATABASE_URL` e `DIRECT_URL`: as do passo 2.
   - `FRONTEND_URL`: o endereço do site na Vercel, **exato e sem `/` no fim** (ex.: `https://origem.vercel.app`). Ele libera o CORS e o cookie do login.
   - `JWT_SECRET` é gerado sozinho, e `NODE_ENV` já vem como `production`.
3. O build (`npm run render-build`) instala, compila e aplica as migrations no Supabase.
4. Teste o endereço do serviço (ex.: `https://origem-backend.onrender.com/`): deve responder `{"status":"ok","api":"Origem"}`.

No plano gratuito o serviço "dorme" após 15 minutos sem uso, e a primeira requisição leva até 1 minuto. Por isso o front espera até 60 s (`timeout` em `frontend/src/services/api.ts`).

### 4. Dados de exemplo (uma vez só)

O seed **apaga tudo** e carrega os dados do `db.json` (peças, artesãos, pedidos e as contas de teste com a senha `Origem@123`). Rode **só uma vez**, logo após o primeiro deploy. Depois disso, rodar de novo apaga os pedidos e as contas reais.

No PowerShell, dentro de `backend/` (as variáveis valem só para esta janela):

```powershell
$env:DATABASE_URL = "<URL do Transaction pooler>?pgbouncer=true"
$env:DIRECT_URL = "<URL do Session pooler>"
npm run prisma:seed
```

### 5. Frontend na Vercel

1. No projeto da Vercel, confira **Root Directory = `frontend`**.
2. Em **Settings → Environment Variables**, crie `NEXT_PUBLIC_API_URL` com o endereço do backend + `/api` (ex.: `https://origem-backend.onrender.com/api`).
3. Faça um **Redeploy**: variáveis `NEXT_PUBLIC_` entram no código na hora do build, então mudar a variável sem um build novo não tem efeito.

### 6. Testar no site publicado

- A vitrine carrega peças (a primeira visita pode demorar se o backend estiver dormindo).
- Login com `ana.beatriz@email.com` / `Origem@123`, recarregar a página e continuar logada, ver "Meus pedidos", sair.
- Testar também no **Safari** (ou no iPhone). O site e a API ficam em domínios diferentes (`vercel.app` e `onrender.com`), e o Safari pode bloquear o cookie do login. Se isso acontecer, a saída é fazer a Vercel repassar `/api` para o Render (rewrite no `next.config.ts`), para o navegador ver um único domínio.

### Cache (Redis)

O `render.yaml` também cria o **`origem-cache`** (Key Value, o Redis do Render, plano gratuito) e liga a `REDIS_URL` do backend a ele. Se o Blueprint já existia antes do cache, abra o Blueprint no Render e clique em **Sync** (ou espere o sync automático depois do merge na `main`) para ele criar o cache.

Para conferir: abra `https://<backend>/api/produtos` duas vezes e veja, nas ferramentas do navegador (aba Network/Rede), o cabeçalho `X-Cache`: `MISS` na primeira vez, `HIT` na segunda.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Build do Render falha em `tsc` ou `prisma: not found` | o build precisa ser `npm run render-build` (instala as dependências de desenvolvimento) |
| `P1001: Can't reach database server` | `DIRECT_URL` com a "Direct connection" (IPv6); use o Session pooler |
| `prepared statement "s0" already exists` | faltou `?pgbouncer=true` na `DATABASE_URL` |
| Erro de CORS no navegador | `FRONTEND_URL` diferente do endereço do site (`/` no fim, `http` em vez de `https`, URL de preview da Vercel) |
| Login funciona, mas ao recarregar a página sai da conta | cookie bloqueado pelo navegador (ver Safari, acima) |
| Site mostra "Não foi possível conectar ao servidor." | backend dormindo ou fora do ar; abra o endereço do backend e espere acordar |
| `X-Cache` sempre `MISS` | `REDIS_URL` vazia (falta o Sync do Blueprint) ou `origem-cache` fora do ar; o site funciona, só sem cache |
