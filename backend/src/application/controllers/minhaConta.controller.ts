import type { NextFunction, Request, Response } from "express"
import { minhaContaService } from "../../infrastructure/services/minhaConta.service"
import { pedidosService } from "../../infrastructure/services/pedidos.service"
import { AppError } from "../../shared/AppError"
import type { AtualizarEstoqueInput } from "../../shared/types/artesao"
import { ehObjeto } from "../../shared/validacao"

// Todas as rotas de /minha-conta passam pelo authMiddleware; isto é só para o TypeScript saber que há usuário.
function usuarioLogado(req: Request) {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")
  return req.user
}

export const minhaContaController = {
  // GET /minha-conta
  async conta(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.conta(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/pedidos — só os pedidos de quem está logado.
  async pedidos(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await pedidosService.listarDoUsuario(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/produtos (artesão)
  async produtos(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.produtos(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/resumo (artesão)
  async resumo(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.resumo(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // PATCH /minha-conta/produtos/:id (artesão) — corpo: { estoque? } e/ou { status? }
  async atualizarProduto(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = usuarioLogado(req)
      const b = ehObjeto(req.body) ? req.body : {}

      if (b.estoque === undefined && b.status === undefined) {
        throw new AppError(400, "VALIDATION", "Informe o estoque ou o status da peça.")
      }
      if (b.estoque !== undefined && (typeof b.estoque !== "number" || !Number.isInteger(b.estoque) || b.estoque < 0)) {
        throw new AppError(400, "VALIDATION", "O estoque precisa ser um número inteiro, zero ou maior.")
      }
      if (b.status !== undefined && b.status !== "publicado" && b.status !== "indisponivel") {
        throw new AppError(400, "VALIDATION", "Status inválido.")
      }

      const input: AtualizarEstoqueInput = {
        estoque: b.estoque as number | undefined,
        status: b.status as AtualizarEstoqueInput["status"],
      }
      const produto = await minhaContaService.atualizarProduto(usuario.id, req.params.id, input)
      return res.status(200).json(produto)
    } catch (err) {
      return next(err)
    }
  },
}
