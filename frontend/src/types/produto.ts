import type { OpcaoFiltro } from "@/constants/categorias"

// Contrato de produto: o formato que a Fake API devolve agora e o backend devolverá na Avaliação 2.

// Situação da peça no catálogo do artesão (as chaves batem com o StatusBadge).
// Só "publicado" aparece para o comprador.
export type StatusProduto = "publicado" | "emAnalise" | "rascunho" | "indisponivel" | "vendida"

// Peça do catálogo. O mesmo formato serve para o card (que usa só alguns campos) e para a página de detalhe.
export type Produto = {
  id: string
  titulo: string
  artesaoId: string
  artesaoNome: string   // ex.: "Mestre Joãozinho" (para exibir no card)
  cidade: string        // ex.: "Tracunhaém"
  tags: string[]        // ex.: ["Peça única", "Barro"]
  medidas: string       // ex.: "15 × 27 × 15cm"
  preco: number         // em reais, ex.: 167.9
  imagemUrl: string     // capa
  imagens: string[]     // galeria (a primeira é a capa)
  categoria: string     // id de constants/categorias.ts
  tecnica: string       // id de constants/tecnicas.ts
  material: string      // id de constants/materiais.ts
  regiao: string        // id de constants/regioes.ts
  estoque: number
  pecaUnica: boolean
  status: StatusProduto
  descricao: string
  cuidados: string
  criadoEm: string      // ISO 8601
}

export type OrdenacaoProduto = "relevancia" | "menor_preco" | "maior_preco" | "recentes"

// Filtros da vitrine (GET /produtos). Todos opcionais; combinam entre si (E lógico).
export type FiltrosProduto = {
  busca?: string        // título, artesão, cidade, categoria, técnica, material e tags
  categoria?: string
  tecnica?: string
  material?: string
  regiao?: string
  precoMin?: number
  precoMax?: number
  disponivel?: "sim"    // só peças com estoque
  artesaoId?: string    // peças de um artesão (perfil público)
  ordenar?: OrdenacaoProduto
  page?: number
  pageSize?: number
}

// O que o artesão envia ao criar ou editar uma peça.
export type ProdutoInput = {
  titulo: string
  categoria: string
  descricao: string
  material: string
  tecnica: string
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

// O que o artesão envia ao editar o estoque de uma peça.
export type AtualizarEstoqueInput = {
  estoque?: number
  status?: "indisponivel" | "publicado"
}

// Opções dos filtros da vitrine (GET /filtros).
export type OpcoesFiltro = {
  categorias: OpcaoFiltro[]
  tecnicas: OpcaoFiltro[]
  materiais: OpcaoFiltro[]
  regioes: OpcaoFiltro[]
}
