import { api } from "./api"
import type { Paginated } from "@/types/api"
import type { Acompanhamento, PainelAdmin } from "@/types/admin"
import type { Pedido, StatusPedido } from "@/types/pedido"

// Chamadas das telas do administrador.
export const adminService = {
  /** GET /admin/painel: resumo, pendências, notificações e atividades da tela inicial. */
  async painel() {
    const response = await api.get<PainelAdmin>("/admin/painel")
    return response.data
  },

  async acompanhamento() {
    const response = await api.get<Acompanhamento>("/admin/acompanhamento")
    return response.data
  },

  async pedidos(filtros: { status?: StatusPedido; page?: number; pageSize?: number } = {}) {
    const response = await api.get<Paginated<Pedido>>("/admin/pedidos", { params: filtros })
    return response.data
  },
}
