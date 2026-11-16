import type { NextFunction, Request, Response } from "express"
import { filtrosService } from "../../infrastructure/services/filtros.service"

export const filtrosController = {
  // GET /filtros
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const opcoes = await filtrosService.listar()
      return res.status(200).json(opcoes)
    } catch (err) {
      return next(err)
    }
  },
}
