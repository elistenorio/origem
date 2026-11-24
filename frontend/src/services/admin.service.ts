import { api } from "./api"
import type { Paginated } from "@/types/api"
import type { Acompanhamento, DecidirCuradoriaInput, Indicadores, ItemCuradoria, PainelAdmin, PeriodoIndicadores, TipoCuradoria } from "@/types/admin"
import type { Artesao } from "@/types/artesao"
import type { Pedido, StatusPedido } from "@/types/pedido"
import type { Produto } from "@/types/produto"
import type { Usuario } from "@/types/usuario"

export type FiltrosGestao = { busca?: string; status?: string; page?: number; pageSize?: number }

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

  async pedidos(filtros: { status?: StatusPedido; busca?: string; page?: number; pageSize?: number } = {}) {
    const response = await api.get<Paginated<Pedido>>("/admin/pedidos", { params: filtros })
    return response.data
  },

  async curadoria(tipo: TipoCuradoria) {
    const response = await api.get<ItemCuradoria[]>("/admin/curadoria", { params: { tipo } })
    return response.data
  },

  async decidirCuradoria(tipo: TipoCuradoria, id: string, input: DecidirCuradoriaInput) {
    await api.patch(`/admin/curadoria/${tipo}/${id}`, input)
  },

  async indicadores(periodo: PeriodoIndicadores) {
    const response = await api.get<Indicadores>("/admin/indicadores", { params: { periodo } })
    return response.data
  },

  async artesaos(filtros: FiltrosGestao) {
    const response = await api.get<Paginated<Artesao>>("/admin/artesaos", { params: filtros })
    return response.data
  },

  async clientes(filtros: FiltrosGestao) {
    const response = await api.get<Paginated<Usuario>>("/admin/usuarios", { params: filtros })
    return response.data
  },

  async produtos(filtros: FiltrosGestao) {
    const response = await api.get<Paginated<Produto>>("/admin/produtos", { params: filtros })
    return response.data
  },

  async alterarStatusArtesao(id: string, status: "publicado" | "indisponivel") {
    await api.patch(`/admin/artesaos/${id}`, { status })
  },

  async alterarStatusCliente(id: string, status: "ativo" | "suspenso") {
    await api.patch(`/admin/usuarios/${id}`, { status })
  },
}
