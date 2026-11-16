import type { NextFunction, Request, Response } from "express"
import { adminService } from "../../infrastructure/services/admin.service"

export const adminController = {
  // GET /admin/painel (só admin: conferido pelo roleMiddleware na rota)
  async painel(_req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await adminService.painel())
    } catch (err) {
      return next(err)
    }
  },
}
