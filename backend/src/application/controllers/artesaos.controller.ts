import type { NextFunction, Request, Response } from "express"
import { artesaosService } from "../../infrastructure/services/artesaos.service"
import { readPagination } from "../../shared/pagination"
import { textoDaQuery } from "../../shared/validacao"

export const artesaosController = {
  // GET /artesaos — filtros busca, regiao, categoria e tecnica; paginação.
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const filtros = {
        busca: textoDaQuery(req.query.busca),
        regiao: textoDaQuery(req.query.regiao),
        categoria: textoDaQuery(req.query.categoria),
        tecnica: textoDaQuery(req.query.tecnica),
      }
      const resultado = await artesaosService.listar(filtros, readPagination(req.query))
      return res.status(200).json(resultado)
    } catch (err) {
      return next(err)
    }
  },

  // GET /artesaos/:id
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const artesao = await artesaosService.buscarPorId(req.params.id)
      return res.status(200).json(artesao)
    } catch (err) {
      return next(err)
    }
  },
}
