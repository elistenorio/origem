import type { NextFunction, Request, Response } from "express"
import { avaliacoesService } from "../../infrastructure/services/avaliacoes.service"
import { AppError, naoAutenticado } from "../../shared/AppError"
import type { NotasAvaliacao } from "../../shared/types/pedido"
import { ehObjeto, texto } from "../../shared/validacao"

const notaValida = (valor: unknown): valor is number =>
  typeof valor === "number" && Number.isInteger(valor) && valor >= 1 && valor <= 5

export const avaliacoesController = {
  // POST /avaliacoes — corpo: { pedidoId, nota, comentario, notas: { produto?, embalagem?, entrega? } }
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw naoAutenticado()
      const b = ehObjeto(req.body) ? req.body : {}

      if (!notaValida(b.nota)) throw new AppError(400, "VALIDATION", "Dê uma nota de 1 a 5 estrelas.")
      const pedidoId = texto(b.pedidoId)
      if (!pedidoId) throw new AppError(400, "VALIDATION", "Informe o pedido avaliado.")

      // Notas por item são opcionais; quando vierem, também precisam ser de 1 a 5.
      const n = ehObjeto(b.notas) ? b.notas : {}
      const notas: NotasAvaliacao = {}
      for (const chave of ["produto", "embalagem", "entrega"] as const) {
        if (n[chave] === undefined) continue
        if (!notaValida(n[chave])) throw new AppError(400, "VALIDATION", "As notas precisam ser de 1 a 5.")
        notas[chave] = n[chave]
      }

      const avaliacao = await avaliacoesService.criar({ pedidoId, nota: b.nota, comentario: texto(b.comentario), notas }, req.user)
      return res.status(201).json(avaliacao)
    } catch (err) {
      return next(err)
    }
  },
}
