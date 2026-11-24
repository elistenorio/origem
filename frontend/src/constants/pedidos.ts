import type { OpcaoFiltro } from "./categorias"
import type { StatusAvanco, StatusPedido } from "@/types/pedido"

export const PROXIMO_PASSO: Partial<Record<StatusPedido, { status: StatusAvanco; acao: string }>> = {
  processando: { status: "emSeparacao", acao: "Marcar como separado" },
  emSeparacao: { status: "enviado", acao: "Marcar como enviado" },
  enviado: { status: "entregue", acao: "Marcar como entregue" },
}

export const FILTROS_STATUS_PEDIDO: OpcaoFiltro[] = [
  { value: "", label: "Todos os status" },
  { value: "processando", label: "Processando" },
  { value: "emSeparacao", label: "Em separação" },
  { value: "enviado", label: "Enviado" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
]

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
