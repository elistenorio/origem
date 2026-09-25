const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

// 167.9 -> "R$ 167,90"
export const formatCurrency = (valor: number) => moeda.format(valor)

// 1250.9 -> { inteiro: "1.250", centavos: "90" } (para deixar os centavos menores, como no design)
export function splitCurrency(valor: number) {
  const [inteiro, centavos] = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(valor)
    .split(",")
  return { inteiro, centavos }
}

// 24380 -> "24,4 mil"
export const formatCompact = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(valor)

// 24380 -> "R$ 24,4 mil" (valores grandes em cards de resumo)
export const formatCurrencyCompact = (valor: number) => (valor >= 10000 ? `R$ ${formatCompact(valor)}` : formatCurrency(valor))
