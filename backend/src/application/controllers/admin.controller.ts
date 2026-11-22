import type { NextFunction, Request, Response } from "express"
import { DecisaoCuradoria, StatusPedido, TipoCuradoria } from "@prisma/client"
import { adminService } from "../../infrastructure/services/admin.service"
import { curadoriaService } from "../../infrastructure/services/curadoria.service"
import { pedidosService } from "../../infrastructure/services/pedidos.service"
import { AppError } from "../../shared/AppError"
import { readPagination } from "../../shared/pagination"
import { ehObjeto, texto, textoDaQuery } from "../../shared/validacao"

const STATUS_PEDIDO = Object.values(StatusPedido)
const TIPOS_CURADORIA = Object.values(TipoCuradoria)
const DECISOES_CURADORIA = Object.values(DecisaoCuradoria)

function lerTipoCuradoria(valor: unknown): TipoCuradoria {
  const tipo = texto(valor) as TipoCuradoria
  if (!TIPOS_CURADORIA.includes(tipo)) throw new AppError(400, "VALIDATION", "Tipo de curadoria inválido: use artesaos ou pecas.")
  return tipo
}

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

  async curadoria(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await curadoriaService.listar(lerTipoCuradoria(req.query.tipo)))
    } catch (err) {
      return next(err)
    }
  },

  async decidirCuradoria(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")
      const tipo = lerTipoCuradoria(req.params.tipo)
      const b = ehObjeto(req.body) ? req.body : {}

      const decisao = texto(b.decisao) as DecisaoCuradoria
      if (!DECISOES_CURADORIA.includes(decisao)) throw new AppError(400, "VALIDATION", "Escolha aprovar, pedir ajustes ou recusar.")
      const parecer = texto(b.parecer)
      if (decisao !== "aprovar" && !parecer) {
        throw new AppError(400, "VALIDATION", "Escreva o parecer para pedir ajustes ou recusar.")
      }

      await curadoriaService.decidir(tipo, req.params.id, { decisao, parecer }, req.user)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  },
}
