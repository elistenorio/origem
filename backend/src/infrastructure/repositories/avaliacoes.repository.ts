import { prisma } from "../prisma/client"
import type { Avaliacao, CriarAvaliacaoInput, NotasAvaliacao } from "../../shared/types/pedido"

export const avaliacoesRepository = {
  /**
   * Grava a avaliação e marca o pedido como avaliado, numa transação.
   * Só marca se o pedido estiver entregue e ainda sem avaliação; senão desfaz tudo e devolve null
   * (protege contra dois envios ao mesmo tempo).
   */
  async criar(input: CriarAvaliacaoInput): Promise<Avaliacao | null> {
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.pedido.updateMany({
        where: { id: input.pedidoId, status: "entregue", avaliado: false },
        data: { avaliado: true },
      })
      if (count === 0) return null

      const registro = await tx.avaliacao.create({
        data: { pedidoId: input.pedidoId, nota: input.nota, comentario: input.comentario, notas: input.notas },
      })
      return {
        id: registro.id,
        pedidoId: registro.pedidoId,
        nota: registro.nota,
        comentario: registro.comentario,
        notas: registro.notas as NotasAvaliacao,
        criadoEm: registro.criadoEm,
      }
    })
  },
}
