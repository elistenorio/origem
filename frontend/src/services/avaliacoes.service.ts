import { api } from "./api"
import type { Avaliacao, CriarAvaliacaoInput } from "@/types/avaliacao"

export const avaliacoesService = {
  /** POST /avaliacoes: avaliação de um pedido entregue. */
  async criar(input: CriarAvaliacaoInput) {
    const response = await api.post<Avaliacao>("/avaliacoes", input)
    return response.data
  },
}
