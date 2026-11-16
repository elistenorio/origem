import type { CookieOptions } from "express"
import { isProduction } from "./env"
import { TOKEN_EXPIRA_EM_MS } from "./jwt"

export const NOME_COOKIE_TOKEN = "token"

// Opções do cookie do JWT.
// - httpOnly: o JavaScript do navegador não consegue ler o token (protege contra XSS).
// - Em produção o front (Vercel) e o backend (Render) ficam em domínios diferentes:
//   o cookie precisa de sameSite "none", e o navegador só aceita "none" com secure (HTTPS).
// - Local (http://localhost) usa "lax" e sem secure.
// O logout precisa usar as mesmas opções (menos maxAge), senão o navegador não apaga o cookie.
export const opcoesCookieToken: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
}

export const opcoesCookieLogin: CookieOptions = {
  ...opcoesCookieToken,
  maxAge: TOKEN_EXPIRA_EM_MS,
}
