import type { OpcaoFiltro } from "./categorias"

export const BANDEIRAS_CARTAO: OpcaoFiltro[] = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard"].map((b) => ({ value: b, label: b }))
