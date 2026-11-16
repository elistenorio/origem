import type { NextFunction, Request, Response } from "express"
import type { PerfilUsuario } from "@prisma/client"
import { AppError, naoAutenticado } from "../shared/AppError"

// Restringe a rota a alguns perfis. Usar sempre depois do authMiddleware:
//   router.get("/admin/painel", authMiddleware, roleMiddleware(["admin"]), controller.painel)
export function roleMiddleware(perfis: PerfilUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(naoAutenticado())
    }
    if (!perfis.includes(req.user.perfil)) {
      return next(new AppError(403, "FORBIDDEN", "Você não tem permissão para acessar este recurso."))
    }
    return next()
  }
}
