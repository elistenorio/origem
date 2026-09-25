import type { Artesao } from "./artesao"
import type { Produto } from "./produto"

export type PeriodoIndicadores = "7d" | "30d" | "12m"

export type ResumoPlataforma = {
  pedidosHoje: number
  vendasMes: number
  artesaosAtivos: number
  produtosPublicados: number
  clientes: number
}

export type Pendencia = {
  id: string
  titulo: string
  quantidade: number
  href: string
}

export type Atividade = {
  id: string
  autor: string
  descricao: string
  data: string           // ISO 8601
}

export type Notificacao = { id: string; titulo: string; descricao: string }

export type Alerta = { id: string; titulo: string; descricao: string; gravidade: "alta" | "media" }

export type Indicadores = {
  periodo: PeriodoIndicadores
  faturamento: number
  pedidos: number
  ticketMedio: number
  pecasVendidas: number
  artesaosAtivos: number
  clientes: number
  produtosPublicados: number
  visualizacoes: number
  variacoes: Record<"faturamento" | "pedidos" | "ticketMedio" | "pecasVendidas", number> // % vs período anterior
  faturamentoMensal: { mes: string; atual: number; anterior: number }[]
  vendasPorCategoria: { categoria: string; quantidade: number }[]
  pedidosPorSemana: { semana: string; quantidade: number }[]
}

export type PainelAdmin = {
  resumo: ResumoPlataforma
  pendencias: Pendencia[]
  notificacoes: Notificacao[]
  atividades: Atividade[]
}

export type Acompanhamento = {
  contagem: Record<"processando" | "enviado" | "entregue" | "cancelado", number>
  alertas: Alerta[]
  artesaosRecentes: Artesao[]
  produtosPendentes: Produto[]
  atividades: Atividade[]
}

export type TipoCuradoria = "artesaos" | "pecas"

export type ItemCuradoria = {
  id: string
  tipo: TipoCuradoria
  titulo: string          // nome do candidato ou da peça
  subtitulo: string       // cidade/técnica ou artesão
  enviadoEm: string
  imagemUrl: string
  fotos: string[]
  descricao: string
  trajetoria?: string
  documentos: { nome: string; tamanho: string }[]
  historico: { titulo: string; data: string }[]
}

export type DecisaoCuradoria = "aprovar" | "ajustes" | "recusar"

export type DecidirCuradoriaInput = {
  decisao: DecisaoCuradoria
  parecer: string
}
