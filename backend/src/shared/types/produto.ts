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
  // Dados de envio, preenchidos pelo artesão no formulário de peça. Somem do JSON quando vazios.
  peso?: string
  prazoPostagem?: string
  embalagem?: string
}

// POST e PUT /minha-conta/produtos: o que o artesão envia ao criar ou editar uma peça
// (mesmo formato de ProdutoInput em frontend/src/types/produto.ts).
export type ProdutoInput = {
  titulo: string
  categoria: string // id de Categoria
  descricao: string
  material: string // id de Material
  tecnica: string // id de Tecnica
  altura: string
  largura: string
  profundidade: string
  peso: string
  pecaUnica: boolean
  estoque: number
  preco: number
  prazoPostagem: string
  embalagem: string
  cuidadosEnvio: string
  enviarParaAnalise: boolean // false = salvar como rascunho
}

// Valores aceitos nos selects de envio do formulário de peça (iguais aos do ProductForm).
export const PRAZOS_POSTAGEM = ["1", "3", "7"] as const
export const EMBALAGENS = ["caixa", "envelope", "tubo"] as const

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
