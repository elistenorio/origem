import type { NextFunction, Request, Response } from "express"
import { StatusArtesao, StatusProduto, StatusUsuario } from "@prisma/client"
import { gestaoService } from "../../infrastructure/services/gestao.service"
import { AppError, naoAutenticado } from "../../shared/AppError"
import { readPagination } from "../../shared/pagination"
import { ehObjeto, textoDaQuery } from "../../shared/validacao"

function lerFiltros<S extends string>(query: Request["query"], validos: readonly S[]) {
  const status = textoDaQuery(query.status) as S | undefined
  return { busca: textoDaQuery(query.busca), status: status && validos.includes(status) ? status : undefined }
}

function usuarioLogado(req: Request) {
  if (!req.user) throw naoAutenticado()
  return req.user
}

export const gestaoController = {
  async artesaos(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await gestaoService.artesaos(lerFiltros(req.query, Object.values(StatusArtesao)), readPagination(req.query)))
    } catch (err) {
      return next(err)
    }
  },

  async clientes(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await gestaoService.clientes(lerFiltros(req.query, Object.values(StatusUsuario)), readPagination(req.query)))
    } catch (err) {
      return next(err)
    }
  },

  async produtos(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await gestaoService.produtos(lerFiltros(req.query, Object.values(StatusProduto)), readPagination(req.query)))
    } catch (err) {
      return next(err)
    }
  },

  async alterarStatusArtesao(req: Request, res: Response, next: NextFunction) {
    try {
      const status = ehObjeto(req.body) ? req.body.status : undefined
      if (status !== "publicado" && status !== "indisponivel") {
        throw new AppError(400, "VALIDATION", "Status inválido: use publicado (reativar) ou indisponivel (suspender).")
      }
      await gestaoService.alterarStatusArtesao(req.params.id, status, usuarioLogado(req))
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  },

  async alterarStatusCliente(req: Request, res: Response, next: NextFunction) {
    try {
      const status = ehObjeto(req.body) ? req.body.status : undefined
      if (status !== "ativo" && status !== "suspenso") {
        throw new AppError(400, "VALIDATION", "Status inválido: use ativo (reativar) ou suspenso (suspender).")
      }
      await gestaoService.alterarStatusCliente(req.params.id, status, usuarioLogado(req))
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  },
}
