import type { NextFunction, Request, Response } from "express"
import { produtosService } from "../../infrastructure/services/produtos.service"
import { readPagination } from "../../shared/pagination"
import { ORDENACOES_PRODUTO, type FiltrosProduto, type OrdenacaoProduto } from "../../shared/types/produto"
import { numeroDaQuery, textoDaQuery } from "../../shared/validacao"

// Lê os filtros da query string. Valores inválidos são ignorados (como na Fake API), não dão erro.
function lerFiltros(query: Request["query"]): FiltrosProduto {
  const ordenar = textoDaQuery(query.ordenar)
  return {
    busca: textoDaQuery(query.busca),
    categoria: textoDaQuery(query.categoria),
    tecnica: textoDaQuery(query.tecnica),
    material: textoDaQuery(query.material),
    regiao: textoDaQuery(query.regiao),
    artesaoId: textoDaQuery(query.artesaoId),
    // "|| undefined": 0 ou valor inválido = sem limite, como na Fake API.
    precoMin: numeroDaQuery(query.precoMin) || undefined,
    precoMax: numeroDaQuery(query.precoMax) || undefined,
    disponivel: textoDaQuery(query.disponivel) === "sim",
    ordenar: ORDENACOES_PRODUTO.includes(ordenar as OrdenacaoProduto) ? (ordenar as OrdenacaoProduto) : "relevancia",
  }
}

export const produtosController = {
  // GET /produtos — vitrine com busca, filtros, ordenação e paginação.
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { dados, cache } = await produtosService.listar(lerFiltros(req.query), readPagination(req.query))
      res.setHeader("X-Cache", cache) // HIT = veio do Redis; MISS = veio do banco
      return res.status(200).json(dados)
    } catch (err) {
      return next(err)
    }
  },

  // GET /produtos/:id
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { dados, cache } = await produtosService.buscarPorId(req.params.id)
      res.setHeader("X-Cache", cache)
      return res.status(200).json(dados)
    } catch (err) {
      return next(err)
    }
  },

  // GET /produtos/:id/relacionados
  async relacionados(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await produtosService.relacionados(req.params.id)
      return res.status(200).json(produtos)
    } catch (err) {
      return next(err)
    }
  },
}
