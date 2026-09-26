import { api } from "./api"
import type { Paginated } from "@/types/api"
import type { Artesao, FiltrosArtesao } from "@/types/artesao"

// Chamadas de artesãos que as telas usam (via hooks).
export const artesaosService = {
  /** GET /artesaos: lista de artesãos e destaques da home. */
  async listar(filtros: FiltrosArtesao = {}) {
    const response = await api.get<Paginated<Artesao>>("/artesaos", { params: filtros })
    return response.data
  },

  /** GET /artesaos/{id}: perfil público. */
  async buscarPorId(id: string) {
    const response = await api.get<Artesao>(`/artesaos/${id}`)
    return response.data
  },
}
