import type { Comprador, Endereco, FormaPagamento } from "./pedido"

// Dados do formulário de checkout (estado da tela). Os dados do cartão
// não são enviados na Avaliação 1: o pagamento real entra na Avaliação 2.
export type DadosCheckout = Comprador &
  Endereco & {
    pagamento: FormaPagamento
    parcelas: string
    numeroCartao: string
    nomeCartao: string
    validade: string
    cvv: string
  }

export type ErrosCheckout = Partial<Record<keyof DadosCheckout, string>>
