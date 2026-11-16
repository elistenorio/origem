// Contrato do painel do administrador: o mesmo formato de frontend/src/types/admin.ts.

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
