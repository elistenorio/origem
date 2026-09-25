import { api } from "./api"
import type { CriarPedidoInput, Pedido } from "@/types/pedido"

export const pedidosService = {
  /** POST /pedidos: finaliza a compra e devolve o pedido criado. */
  async criar(input: CriarPedidoInput) {
    const response = await api.post<Pedido>("/pedidos", input)
    return response.data
  },
}
