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

// GET /minha-conta/perfil: o perfil do artesão logado, com os dados que só ele vê.
export type PerfilArtesao = Artesao & {
  telefone: string // do Usuario ligado
  parecerCuradoria?: string
  tempoAtuacao: string // "" quando ainda não foi preenchido
}

// PUT /minha-conta/perfil: o que o artesão pode mudar no próprio perfil. O e-mail não muda por aqui.
export type PerfilArtesaoInput = {
  nome: string
  cidade: string
  estado: string // UF, ex.: "PE"
  telefone: string
  historia: string
  trabalho: string
  origemTrabalho: string
  gostaDeFazer: string
  tempoAtuacao: string
  categorias: string[] // ids de Categoria ("Área de atuação")
  tecnicas: string[] // rótulos, ex.: ["Modelagem manual"]
}

// Faixas aceitas em "Tempo de atuação" (iguais às do formulário de perfil).
export const FAIXAS_TEMPO_ATUACAO = ["menos-1", "1-3", "3-10", "mais-10"] as const

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

export type ComprovacoesArtesao = {
  possuiRegistro: boolean
  participouFeiras: boolean
  pertenceAssociacao: boolean
  associacao: string
  links: string[]
}

export type CadastroArtesaoInput = {
  nome: string
  email: string
  senha: string
  telefone: string
  nomeArtistico: string
  oficio: string
  tempoAtuacao: string
  categoria: string
  tecnicas: string[]
  cidade: string
  estado: string
  regiao: string
  historia: string
  trabalho: string
  origemTrabalho: string
  gostaDeFazer: string
  comprovacoes: ComprovacoesArtesao
}

export type NotificacaoArtesao = { titulo: string; descricao: string; data: Date }

export type PainelArtesao = {
  nome: string
  status: StatusArtesao
  parecerCuradoria?: string
  publicadas: number
  vendidasSemana: number
  vendasMes: number
  avaliacaoMedia: number | null
  totalAvaliacoes: number
  notificacoes: NotificacaoArtesao[]
}
