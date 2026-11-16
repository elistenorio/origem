import type { NextFunction, Request, Response } from "express"
import { AppError, naoAutenticado } from "../shared/AppError"
import { NOME_COOKIE_TOKEN } from "../shared/cookie"
import { verificarToken } from "../shared/jwt"

// Protege a rota: só passa quem tem um token válido no cookie httpOnly.
// Coloca { id, perfil } em req.user para os controllers usarem.
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token: unknown = req.cookies?.[NOME_COOKIE_TOKEN]

  if (typeof token !== "string" || !token) {
    return next(naoAutenticado())
  }

  try {
    req.user = verificarToken(token)
    return next()
  } catch {
    return next(new AppError(401, "UNAUTHORIZED", "Sessão inválida ou expirada. Faça login novamente."))
  }
}

// Para rotas abertas a visitantes (ex.: POST /pedidos): se houver um token válido, preenche req.user;
// sem token, ou com token inválido, segue como visitante (nunca responde 401).
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token: unknown = req.cookies?.[NOME_COOKIE_TOKEN]
  if (typeof token === "string" && token) {
    try {
      req.user = verificarToken(token)
    } catch {
      req.user = undefined
    }
  }
  return next()
}
