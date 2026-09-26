import { api } from "./api"
import type { Paginated } from "@/types/api"
import type { FiltrosProduto, OpcoesFiltro, Produto } from "@/types/produto"

// Chamadas de produtos que as telas usam (via hooks).
export const produtosService = {
  /** GET /produtos: catálogo, destaques da home e peças de um artesão (filtro artesaoId). */
  async listar(filtros: FiltrosProduto = {}) {
    const response = await api.get<Paginated<Produto>>("/produtos", { params: filtros })
    return response.data
  },

  /** GET /produtos/{id}: página de detalhe. */
  async buscarPorId(id: string) {
    const response = await api.get<Produto>(`/produtos/${id}`)
    return response.data
  },

  /** GET /produtos/{id}/relacionados: "Peças relacionadas" do detalhe. */
  async relacionados(id: string) {
    const response = await api.get<Produto[]>(`/produtos/${id}/relacionados`)
    return response.data
  },

  /** GET /filtros: opções de categoria, técnica, material e região. */
  async opcoesFiltro() {
    const response = await api.get<OpcoesFiltro>("/filtros")
    return response.data
  },
}
