import { api } from "./api"
import type { CancelarPedidoInput, CriarPedidoInput, Pedido } from "@/types/pedido"

export const pedidosService = {
  /** POST /pedidos: finaliza a compra e devolve o pedido criado. */
  async criar(input: CriarPedidoInput) {
    const response = await api.post<Pedido>("/pedidos", input)
    return response.data
  },

  /** PATCH /pedidos/{id}: cancela o pedido (só antes do envio) e devolve o pedido atualizado. */
  async cancelar(id: string, input: CancelarPedidoInput) {
    const response = await api.patch<Pedido>(`/pedidos/${id}`, input)
    return response.data
  },
}
