export const arredondar = (valor: number) => Math.round(valor * 100) / 100

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export const formatarReais = (valor: number) => moeda.format(arredondar(valor)).replace(/ /g, " ")
