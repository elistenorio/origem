import { AppError } from "../../shared/AppError"
import { paginated, type Pagination } from "../../shared/pagination"
import type { Paginated } from "../../shared/types/api"
import type { Artesao, FiltrosArtesao } from "../../shared/types/artesao"
import { artesaosRepository } from "../repositories/artesaos.repository"
import { filtrosRepository } from "../repositories/filtros.repository"

export const artesaosService = {
  // GET /artesaos: só artesãos publicados.
  async listar(filtros: FiltrosArtesao, paginacao: Pagination): Promise<Paginated<Artesao>> {
    const { busca, tecnica, ...outros } = filtros

    let ids: string[] | undefined
    if (busca) {
      ids = await artesaosRepository.buscarIdsPorTexto(busca)
      if (ids.length === 0) return paginated([], 0, paginacao)
    }

    // O filtro chega com o id da técnica ("renda"); o artesão guarda o nome ("Renda renascença").
    // Id desconhecido: o filtro é ignorado.
    const tecnicaLabel = tecnica ? (await filtrosRepository.buscarTecnica(tecnica))?.label : undefined

    const { itens, total } = await artesaosRepository.listarPublicados({ ...outros, ids, tecnicaLabel }, paginacao)
    return paginated(itens, total, paginacao)
  },

  // GET /artesaos/:id: perfil público; artesão em análise ou indisponível conta como "não encontrado".
  async buscarPorId(id: string): Promise<Artesao> {
    const artesao = await artesaosRepository.buscarPublicadoPorId(id)
    if (!artesao) throw new AppError(404, "NOT_FOUND", "Artesão não encontrado.")
    return artesao
  },
}
