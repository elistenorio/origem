import { AppError } from "../../shared/AppError"
import { paginated, type Pagination } from "../../shared/pagination"
import type { Paginated } from "../../shared/types/api"
import type { FiltrosProduto, Produto } from "../../shared/types/produto"
import { produtosCache, type ComCache } from "../cache/produtos.cache"
import { produtosRepository } from "../repositories/produtos.repository"

const TOTAL_RELACIONADOS = 4

// Busca direto no banco (sem cache). Rascunho, em análise ou indisponível contam como "não encontrada".
async function buscarPublicado(id: string): Promise<Produto> {
  const produto = await produtosRepository.buscarPublicadoPorId(id)
  if (!produto) throw new AppError(404, "NOT_FOUND", "Peça não encontrada.")
  return produto
}

async function listarDoBanco(filtros: FiltrosProduto, paginacao: Pagination): Promise<Paginated<Produto>> {
  const { busca, ...outros } = filtros

  // Com busca, primeiro descobre quais peças contêm o texto; sem nenhuma, nem consulta o resto.
  let ids: string[] | undefined
  if (busca) {
    ids = await produtosRepository.buscarIdsPorTexto(busca)
    if (ids.length === 0) return paginated([], 0, paginacao)
  }

  const { itens, total } = await produtosRepository.listarPublicados({ ...outros, ids }, paginacao)
  return paginated(itens, total, paginacao)
}

export const produtosService = {
  // GET /produtos: só peças publicadas; filtros combinam entre si. Com cache (Redis).
  async listar(filtros: FiltrosProduto, paginacao: Pagination): Promise<ComCache<Paginated<Produto>>> {
    // A chave do cache é a combinação de filtros + página: cada combinação é guardada separada.
    const parametros = JSON.stringify({ ...filtros, page: paginacao.page, pageSize: paginacao.pageSize })
    return produtosCache.comCache("lista", parametros, () => listarDoBanco(filtros, paginacao))
  },

  // GET /produtos/:id. Com cache (Redis); peça não encontrada (404) não é guardada.
  async buscarPorId(id: string): Promise<ComCache<Produto>> {
    return produtosCache.comCache("detalhe", id, () => buscarPublicado(id))
  },

  // GET /produtos/:id/relacionados: 4 peças; primeiro as da mesma categoria, depois as outras.
  // É a recomendação simulada da Avaliação 1 (o módulo de recomendação assume esta rota depois).
  async relacionados(id: string): Promise<Produto[]> {
    const produto = await buscarPublicado(id)

    const mesmaCategoria = await produtosRepository.listarPublicadosPorCategoria({
      categoriaId: produto.categoria,
      mesmaCategoria: true,
      excluirId: produto.id,
      take: TOTAL_RELACIONADOS,
    })
    if (mesmaCategoria.length >= TOTAL_RELACIONADOS) return mesmaCategoria

    const outras = await produtosRepository.listarPublicadosPorCategoria({
      categoriaId: produto.categoria,
      mesmaCategoria: false,
      excluirId: produto.id,
      take: TOTAL_RELACIONADOS - mesmaCategoria.length,
    })
    return [...mesmaCategoria, ...outras]
  },
}
