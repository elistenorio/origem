import jwt from "jsonwebtoken"
import type { PerfilUsuario } from "@prisma/client"
import { env } from "./env"

// O que vai dentro do token: só o necessário para saber quem é e o que pode fazer.
export type TokenPayload = {
  id: string
  perfil: PerfilUsuario
}

export const TOKEN_EXPIRA_EM_MS = 24 * 60 * 60 * 1000 // 1 dia (o cookie dura o mesmo)

export function gerarToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRA_EM_MS / 1000 })
}

// Lança erro se o token for inválido, adulterado ou estiver expirado.
export function verificarToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & TokenPayload
  return { id: decoded.id, perfil: decoded.perfil }
}
