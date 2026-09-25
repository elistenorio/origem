import type { OpcaoFiltro } from "./categorias"

export const MOTIVOS_CANCELAMENTO: OpcaoFiltro[] = [
  { value: "engano", label: "Comprei por engano" },
  { value: "preco", label: "Encontrei um preço melhor" },
  { value: "prazo", label: "O prazo de entrega ficou muito longo" },
  { value: "dados", label: "Quero alterar o endereço ou a forma de pagamento" },
  { value: "outro", label: "Outro motivo" },
]

export const LIMITE_BAIXO_ESTOQUE = 1

// Opções usadas pelos filtros do catálogo
export const ORDENACOES: OpcaoFiltro[] = [
  { value: "relevancia", label: "Mais relevantes" },
  { value: "menor_preco", label: "Menor preço" },
  { value: "maior_preco", label: "Maior preço" },
  { value: "recentes", label: "Mais recentes" },
]
