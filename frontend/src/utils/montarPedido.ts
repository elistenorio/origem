import type { DadosCheckout } from "@/types/checkout"
import type { ItemCarrinho } from "@/types/carrinho"
import type { OpcaoFrete } from "@/types/frete"
import type { CriarPedidoInput } from "@/types/pedido"

// Converte o estado plano do formulário de checkout no corpo de POST /pedidos,
// separando comprador e endereço. Os dados do cartão não são enviados na Avaliação 1.
export function montarPedido(dados: DadosCheckout, itens: ItemCarrinho[], frete: OpcaoFrete): CriarPedidoInput {
  const { nome, cpf, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado } = dados
  return {
    itens: itens.map((item) => ({ produtoId: item.produto.id, quantidade: item.quantidade })),
    comprador: { nome, cpf, email, telefone },
    endereco: { cep, rua, numero, complemento, bairro, cidade, estado },
    frete,
    pagamento: dados.pagamento,
    parcelas: Number(dados.parcelas),
  }
}
