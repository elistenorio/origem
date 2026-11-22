import type { NextFunction, Request, Response } from "express"
import { StatusPedido } from "@prisma/client"
import { adminService } from "../../infrastructure/services/admin.service"
import { pedidosService } from "../../infrastructure/services/pedidos.service"
import { readPagination } from "../../shared/pagination"
import { textoDaQuery } from "../../shared/validacao"

const STATUS_PEDIDO = Object.values(StatusPedido)

export const adminController = {
  // GET /admin/painel (só admin: conferido pelo roleMiddleware na rota)
  async painel(_req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await adminService.painel())
    } catch (err) {
      return next(err)
    }
  },

  async acompanhamento(_req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await adminService.acompanhamento())
    } catch (err) {
      return next(err)
    }
  },

  async pedidos(req: Request, res: Response, next: NextFunction) {
    try {
      const status = textoDaQuery(req.query.status) as StatusPedido | undefined
      const filtro = status && STATUS_PEDIDO.includes(status) ? status : undefined
      return res.status(200).json(await pedidosService.listar(filtro, readPagination(req.query)))
    } catch (err) {
      return next(err)
    }
  },
}
