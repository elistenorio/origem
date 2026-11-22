// Contrato de pedido: o mesmo formato de frontend/src/types/pedido.ts.
import type { FormaPagamento, StatusPedido } from "@prisma/client"
import type { ModalidadeFrete } from "./frete"

export type Endereco = {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

export type Comprador = {
  nome: string
  cpf: string
  email: string
  telefone: string
}

export type ItemPedido = {
  produtoId: string
  titulo: string // "foto" do momento da compra
  imagemUrl: string
  artesaoNome: string
  precoUnitario: number // não muda depois do pedido
  quantidade: number
}

export type EventoPedido = {
  titulo: string
  data: Date
}

export type FretePedido = { modalidade: ModalidadeFrete; valor: number; prazo: string }

export type Pedido = {
  id: string
  codigo: string // "#" + id
  status: StatusPedido
  criadoEm: Date
  itens: ItemPedido[]
  subtotal: number
  frete: FretePedido
  total: number
  comprador: Comprador
  endereco: Endereco
  pagamento: FormaPagamento
  parcelas: number
  codigoRastreio?: string
  previsaoEntrega?: Date
  eventos: EventoPedido[]
  avaliado: boolean
  motivoCancelamento?: string
}

// POST /pedidos, já validado pelo controller.
export type CriarPedidoInput = {
  itens: { produtoId: string; quantidade: number }[]
  comprador: Comprador
  endereco: Endereco
  modalidadeFrete: ModalidadeFrete // o valor e o prazo são recalculados pelo backend a partir do CEP
  pagamento: FormaPagamento
  parcelas: number
}

export const STATUS_AVANCO = ["emSeparacao", "enviado", "entregue"] as const
export type StatusAvanco = (typeof STATUS_AVANCO)[number]

export type AvancarPedidoInput = {
  status: StatusAvanco
  codigoRastreio?: string
}

export type VendaArtesao = {
  id: string
  codigo: string
  status: StatusPedido
  criadoEm: Date
  itens: ItemPedido[]
  subtotal: number
  cidade: string
  codigoRastreio?: string
  previsaoEntrega?: Date
}

export type NotasAvaliacao = {
  produto?: number
  embalagem?: number
  entrega?: number
}

// POST /avaliacoes, já validado pelo controller.
export type CriarAvaliacaoInput = {
  pedidoId: string
  nota: number
  comentario: string
  notas: NotasAvaliacao
}

export type Avaliacao = CriarAvaliacaoInput & {
  id: string
  criadoEm: Date
}
