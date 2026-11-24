// Datas no fuso de Pernambuco (America/Recife: UTC-3, sem horário de verão).
// O servidor (Render) roda em UTC; sem isto, "hoje" viraria o dia seguinte às 21h de Recife.
const FUSO_RECIFE_HORAS = -3

// Data de agora "vista" em Recife (os campos UTC deste Date mostram a hora local de Recife).
function emRecife(agora: Date): Date {
  return new Date(agora.getTime() + FUSO_RECIFE_HORAS * 60 * 60 * 1000)
}

/** Meia-noite de hoje em Recife, como instante UTC (para comparar com criadoEm no banco). */
export function inicioDoDia(agora = new Date()): Date {
  const local = emRecife(agora)
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), -FUSO_RECIFE_HORAS))
}

/** Dia 1º do mês atual, meia-noite em Recife, como instante UTC. */
export function inicioDoMes(agora = new Date()): Date {
  const local = emRecife(agora)
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1, -FUSO_RECIFE_HORAS))
}

export function adicionarDiasUteis(inicio: Date, dias: number): Date {
  const data = new Date(inicio.getTime())
  let restantes = dias
  while (restantes > 0) {
    data.setUTCDate(data.getUTCDate() + 1)
    const diaDaSemana = emRecife(data).getUTCDay()
    if (diaDaSemana !== 0 && diaDaSemana !== 6) restantes--
  }
  return data
}

export function diasDesde(data: Date, agora = new Date()): number {
  return Math.floor((agora.getTime() - data.getTime()) / (24 * 60 * 60 * 1000))
}

export function anoMesEmRecife(data: Date): { ano: number; mes: number } {
  const local = emRecife(data)
  return { ano: local.getUTCFullYear(), mes: local.getUTCMonth() }
}

export function inicioDoMesEm(ano: number, mes: number): Date {
  return new Date(Date.UTC(ano, mes, 1, -FUSO_RECIFE_HORAS))
}

export function diaMesEmRecife(data: Date): string {
  const local = emRecife(data)
  return `${String(local.getUTCDate()).padStart(2, "0")}/${String(local.getUTCMonth() + 1).padStart(2, "0")}`
}
