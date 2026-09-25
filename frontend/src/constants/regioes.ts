import type { OpcaoFiltro } from "./categorias"

// Regiões de Pernambuco usadas nos filtros de peças e artesãos.
export const REGIOES: OpcaoFiltro[] = [
  { value: "metropolitana", label: "Região Metropolitana" },
  { value: "zona-da-mata", label: "Zona da Mata" },
  { value: "agreste", label: "Agreste" },
  { value: "sertao", label: "Sertão" },
]

export const ESTADOS: OpcaoFiltro[] = ["PE", "PB", "AL", "RN", "CE", "BA", "SE", "PI", "MA", "SP", "RJ", "MG"].map((uf) => ({ value: uf, label: uf }))
