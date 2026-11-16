import { AppError } from "../../shared/AppError"
import type { TokenPayload } from "../../shared/jwt"
import type { Avaliacao, CriarAvaliacaoInput } from "../../shared/types/pedido"
import { avaliacoesRepository } from "../repositories/avaliacoes.repository"
import { pedidosRepository } from "../repositories/pedidos.repository"

export const avaliacoesService = {
  /** POST /avaliacoes: só o dono do pedido avalia, e só um pedido entregue e ainda não avaliado. */
  async criar(input: CriarAvaliacaoInput, usuario: TokenPayload): Promise<Avaliacao> {
    const encontrado = await pedidosRepository.buscarPorId(input.pedidoId)
    if (!encontrado) throw new AppError(404, "NOT_FOUND", "Pedido não encontrado.")
    if (encontrado.usuarioId !== usuario.id) {
      throw new AppError(403, "FORBIDDEN", "Só quem fez o pedido pode avaliá-lo.")
    }

    const { pedido } = encontrado
    if (pedido.status !== "entregue") throw new AppError(409, "CONFLICT", "Só é possível avaliar pedidos entregues.")
    if (pedido.avaliado) throw new AppError(409, "CONFLICT", "Este pedido já foi avaliado.")

    const avaliacao = await avaliacoesRepository.criar(input)
    // Outro envio avaliou o mesmo pedido no meio do caminho.
    if (!avaliacao) throw new AppError(409, "CONFLICT", "Este pedido já foi avaliado.")
    return avaliacao
  },
}
