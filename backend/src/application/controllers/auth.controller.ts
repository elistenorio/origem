import type { NextFunction, Request, Response } from "express"
import { authService } from "../../infrastructure/services/auth.service"
import { AppError } from "../../shared/AppError"
import { NOME_COOKIE_TOKEN, opcoesCookieLogin, opcoesCookieToken } from "../../shared/cookie"
import { textoPreenchido } from "../../shared/validacao"

export const authController = {
  // POST /auth/login — corpo: { email, senha }. Grava o JWT no cookie httpOnly e devolve o usuário (sem a senha).
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body ?? {}

      if (!textoPreenchido(email) || !textoPreenchido(senha)) {
        throw new AppError(400, "VALIDATION", "Informe e-mail e senha.")
      }

      const { token, usuario } = await authService.login(email, senha)

      res.cookie(NOME_COOKIE_TOKEN, token, opcoesCookieLogin)
      return res.status(200).json(usuario)
    } catch (err) {
      return next(err)
    }
  },

  // POST /auth/logout — apaga o cookie. Funciona mesmo sem estar logado.
  logout(_req: Request, res: Response) {
    res.clearCookie(NOME_COOKIE_TOKEN, opcoesCookieToken)
    return res.status(204).send()
  },

  // GET /auth/me — quem está logado (rota protegida pelo authMiddleware).
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // O authMiddleware garante req.user; a checagem é só para o TypeScript.
      if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")

      const usuario = await authService.usuarioLogado(req.user.id)
      return res.status(200).json(usuario)
    } catch (err) {
      return next(err)
    }
  },
}
