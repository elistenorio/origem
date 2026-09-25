import type { OpcaoFiltro } from "@/constants/categorias"

// Rótulo de um id das constantes (ex.: "ceramica-barro" -> "Cerâmica e Barro"). Sem correspondência, devolve o próprio id.
export const getOptionLabel = (opcoes: OpcaoFiltro[], valor: string) => opcoes.find((o) => o.value === valor)?.label ?? valor
