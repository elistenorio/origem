// Contrato do painel do administrador: o mesmo formato de frontend/src/types/admin.ts.
import type { Artesao } from "./artesao"
import type { Produto } from "./produto"

export type ResumoPlataforma = {
  pedidosHoje: number
  vendasMes: number // em reais
  clientes: number
  artesaosAtivos: number
  produtosPublicados: number
}

export type Pendencia = {
  id: string
  titulo: string
  quantidade: number
  href: string // tela do admin que resolve a pendência
}

export type Notificacao = { id: string; titulo: string; descricao: string }

export type Atividade = {
  id: string
  autor: string
  descricao: string
  data: Date
}

export type PainelAdmin = {
  resumo: ResumoPlataforma
  pendencias: Pendencia[]
  notificacoes: Notificacao[]
  atividades: Atividade[]
}

export type Alerta = { id: string; titulo: string; descricao: string; gravidade: "alta" | "media" }

export type Acompanhamento = {
  contagem: Record<"processando" | "enviado" | "entregue" | "cancelado", number>
  alertas: Alerta[]
  artesaosRecentes: Artesao[]
  produtosPendentes: Produto[]
  atividades: Atividade[]
}

export const PERIODOS_INDICADORES = ["7d", "30d", "12m"] as const
export type PeriodoIndicadores = (typeof PERIODOS_INDICADORES)[number]

export type Indicadores = {
  periodo: PeriodoIndicadores
  faturamento: number
  pedidos: number
  ticketMedio: number
  pecasVendidas: number
  artesaosAtivos: number
  clientes: number
  produtosPublicados: number
  variacoes: Record<"faturamento" | "pedidos" | "ticketMedio" | "pecasVendidas", number>
  faturamentoMensal: { mes: string; atual: number; anterior: number }[]
  vendasPorCategoria: { categoria: string; quantidade: number }[]
  pedidosPorSemana: { semana: string; quantidade: number }[]
}
