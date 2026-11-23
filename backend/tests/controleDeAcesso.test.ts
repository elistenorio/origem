// Teste do cenário de qualidade do ADR-003 (docs/adr) (controle de acesso por perfil).
// Cenário: um comprador logado tenta abrir GET /admin/painel e recebe 403, sem nenhum dado do painel.
// Sem login, a mesma rota responde 401. Só o admin recebe 200.
//
// Roda contra a API já ligada (npm run dev) e com o seed aplicado (npm run prisma:seed).
// Para testar outro endereço (ex.: o backend no Render): API_URL=https://<backend>/api npm run test:acesso
import { test } from "node:test"
import assert from "node:assert/strict"

const API_URL = process.env.API_URL ?? "http://localhost:3001/api"
const SENHA_SEED = "Origem@123" // senha de todas as contas do prisma/seed.ts

// Faz login e devolve o cookie do token, para mandar nas próximas requisições.
async function login(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: SENHA_SEED }),
  })
  assert.equal(res.status, 200, `login de ${email} falhou (o seed foi aplicado?)`)

  const cookie = res.headers.get("set-cookie")
  assert.ok(cookie, "o login não devolveu o cookie do token")
  return cookie.split(";")[0] // só "token=...", sem as opções do cookie
}

async function abrirPainel(cookie?: string) {
  const res = await fetch(`${API_URL}/admin/painel`, {
    headers: cookie ? { Cookie: cookie } : {},
  })
  return { status: res.status, corpo: await res.json() }
}

// A resposta de erro só pode ter { error: { code, message } }: nenhum dado do painel.
function assertSoErro(corpo: unknown, code: string) {
  assert.deepEqual(Object.keys(corpo as object), ["error"])
  assert.equal((corpo as { error: { code: string } }).error.code, code)
}

test("sem login: GET /admin/painel responde 401 UNAUTHORIZED", async () => {
  const { status, corpo } = await abrirPainel()
  assert.equal(status, 401)
  assertSoErro(corpo, "UNAUTHORIZED")
})

test("comprador logado: GET /admin/painel responde 403 FORBIDDEN, sem dados do painel", async () => {
  const cookie = await login("ana.beatriz@email.com")
  const { status, corpo } = await abrirPainel(cookie)
  assert.equal(status, 403)
  assertSoErro(corpo, "FORBIDDEN")
})

test("artesão logado: GET /admin/painel responde 403 FORBIDDEN, sem dados do painel", async () => {
  const cookie = await login("joaozinho@email.com")
  const { status, corpo } = await abrirPainel(cookie)
  assert.equal(status, 403)
  assertSoErro(corpo, "FORBIDDEN")
})

test("admin logado: GET /admin/painel responde 200 com os indicadores", async () => {
  const cookie = await login("admin@origem.com")
  const { status, corpo } = await abrirPainel(cookie)
  assert.equal(status, 200)
  assert.equal("error" in corpo, false)
})
