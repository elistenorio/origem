// Contrato do perfil público do artesão: o mesmo formato de frontend/src/types/artesao.ts.
import type { StatusArtesao } from "@prisma/client"

export type Artesao = {
  id: string
  nome: string
  oficio: string
  cidade: string
  estado: string
  regiao: string // id de Regiao
  bio: string
  historia: string
  citacao: string
  // Opcionais: só aparecem no JSON para quem tem o texto.
  trabalho?: string
  origemTrabalho?: string
  citacaoOrigem?: string
  gostaDeFazer?: string
  fotoUrl: string
  tecnicas: string[]
  categorias: string[]
  totalProdutos: number // peças publicadas, contadas no banco
  email: string // vem do Usuario ligado ao artesão
  status: StatusArtesao
  criadoEm: Date
}

// GET /minha-conta/resumo: números do topo de "Meu catálogo" e "Estoque".
export type ResumoPainelArtesao = {
  catalogo: { publicadas: number; emAnalise: number; vendidas: number; indisponiveis: number }
  estoque: { disponiveis: number; baixoEstoque: number; esgotadas: number }
}

// PATCH /minha-conta/produtos/:id, já validado pelo controller (pelo menos um dos dois).
export type AtualizarEstoqueInput = {
  estoque?: number
  status?: "publicado" | "indisponivel"
}

// Filtros de GET /artesaos, já convertidos pelo controller.
export type FiltrosArtesao = {
  busca?: string
  regiao?: string
  categoria?: string
  tecnica?: string // id de Tecnica (ex.: "renda")
}
