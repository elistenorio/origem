import type { NextFunction, Request, Response } from "express"
import { AppError } from "../shared/AppError"
import { NOME_COOKIE_TOKEN } from "../shared/cookie"
import { verificarToken } from "../shared/jwt"

// Protege a rota: só passa quem tem um token válido no cookie httpOnly.
// Coloca { id, perfil } em req.user para os controllers usarem.
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token: unknown = req.cookies?.[NOME_COOKIE_TOKEN]

  if (typeof token !== "string" || !token) {
    return next(new AppError(401, "UNAUTHORIZED", "Faça login para continuar."))
  }

  try {
    req.user = verificarToken(token)
    return next()
  } catch {
    return next(new AppError(401, "UNAUTHORIZED", "Sessão inválida ou expirada. Faça login novamente."))
  }
}
