// Contrato de produto: o mesmo formato de frontend/src/types/produto.ts.
import type { StatusProduto } from "@prisma/client"

export type Produto = {
  id: string
  titulo: string
  artesaoId: string
  artesaoNome: string // vem do Artesao
  cidade: string // vem do Artesao
  tags: string[]
  medidas: string
  preco: number
  imagemUrl: string
  imagens: string[]
  categoria: string // id de Categoria
  tecnica: string // id de Tecnica
  material: string // id de Material
  regiao: string // id de Regiao
  estoque: number
  pecaUnica: boolean
  status: StatusProduto
  descricao: string
  cuidados: string
  criadoEm: Date // vira texto ISO 8601 no JSON
}

export const ORDENACOES_PRODUTO = ["relevancia", "menor_preco", "maior_preco", "recentes"] as const
export type OrdenacaoProduto = (typeof ORDENACOES_PRODUTO)[number]

// Filtros de GET /produtos, já convertidos pelo controller.
export type FiltrosProduto = {
  busca?: string
  categoria?: string
  tecnica?: string
  material?: string
  regiao?: string
  artesaoId?: string
  precoMin?: number
  precoMax?: number
  disponivel: boolean
  ordenar: OrdenacaoProduto
}

export type OpcaoFiltro = { value: string; label: string }

export type OpcoesFiltro = {
  categorias: OpcaoFiltro[]
  tecnicas: OpcaoFiltro[]
  materiais: OpcaoFiltro[]
  regioes: OpcaoFiltro[]
}
