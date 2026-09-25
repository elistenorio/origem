import type { ModalidadeFrete, OpcaoFrete } from "./frete"

export type StatusPedido = "processando" | "emSeparacao" | "enviado" | "entregue" | "cancelado"

export type FormaPagamento = "cartao" | "pix" | "boleto"

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

// O que o front ENVIA em POST /pedidos
export type CriarPedidoInput = {
  itens: { produtoId: string; quantidade: number }[]
  comprador: Comprador
  endereco: Endereco
  frete: OpcaoFrete     // a opção escolhida entre as que GET /frete devolveu
  pagamento: FormaPagamento
  parcelas: number
}

export type ItemPedido = {
  produtoId: string
  titulo: string        // "foto" do momento da compra
  imagemUrl: string
  artesaoNome: string
  precoUnitario: number // preço não muda depois do pedido
  quantidade: number
}

export type EventoPedido = {
  titulo: string        // ex.: "Pagamento confirmado"
  data: string          // ISO 8601
}

// O que a API DEVOLVE
export type Pedido = {
  id: string
  codigo: string        // ex.: "#10495"
  status: StatusPedido
  criadoEm: string
  itens: ItemPedido[]
  subtotal: number
  frete: { modalidade: ModalidadeFrete; valor: number; prazo: string }
  total: number
  comprador: Comprador
  endereco: Endereco
  pagamento: FormaPagamento
  parcelas: number
  codigoRastreio?: string
  previsaoEntrega?: string
  eventos: EventoPedido[]
  avaliado: boolean
  motivoCancelamento?: string
}

export type CancelarPedidoInput = {
  motivo: string
  observacao?: string
}
