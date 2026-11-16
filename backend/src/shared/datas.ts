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
