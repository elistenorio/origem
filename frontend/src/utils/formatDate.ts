// "2026-09-20T11:43:00Z" -> "20/09/2026"
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Recife" })

// "2026-09-20T11:43:00Z" -> "20/09/2026 · 08:43"
export const formatDateTime = (iso: string) => {
  const data = new Date(iso)
  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Recife" })
  return `${formatDate(iso)} · ${hora}`
}
