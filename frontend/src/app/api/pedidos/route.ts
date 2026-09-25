import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import type { CriarPedidoInput, ItemPedido, Pedido } from "@/types/pedido"

const arredondar = (valor: number) => Math.round(valor * 100) / 100

// POST /api/pedidos: cria o pedido a partir do carrinho (compra como visitante).
// O pedido é guardado só em memória (como o `let DB` da aula 06): some quando o servidor reinicia.
export async function POST(request: NextRequest) {
  const input = (await request.json().catch(() => null)) as CriarPedidoInput | null

  if (!input?.itens?.length) return fail(400, "VALIDATION", "O pedido precisa ter pelo menos uma peça.")
  if (!input.comprador?.nome || !input.comprador?.email) return fail(400, "VALIDATION", "Informe nome e e-mail do comprador.")
  if (!input.endereco?.cep) return fail(400, "VALIDATION", "Informe o endereço de entrega.")
  if (!input.frete) return fail(400, "VALIDATION", "Escolha uma opção de frete.")
  if (!input.pagamento) return fail(400, "VALIDATION", "Escolha a forma de pagamento.")

  // "Foto" de cada peça no momento da compra: título e preço não mudam depois.
  const itens: ItemPedido[] = []
  for (const { produtoId, quantidade } of input.itens) {
    const produto = db.produtos.find((p) => p.id === produtoId && p.status === "publicado")
    if (!produto) return fail(404, "NOT_FOUND", "Uma das peças do carrinho não está mais disponível.")
    if (quantidade < 1 || quantidade > produto.estoque) {
      return fail(409, "OUT_OF_STOCK", `Estoque insuficiente para "${produto.titulo}".`)
    }
    itens.push({
      produtoId,
      titulo: produto.titulo,
      imagemUrl: produto.imagemUrl,
      artesaoNome: produto.artesaoNome,
      precoUnitario: produto.preco,
      quantidade,
    })
  }

  const subtotal = arredondar(itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0))
  const agora = new Date().toISOString()
  const id = String(Math.max(...db.pedidos.map((p) => Number(p.id))) + 1)

  const pedido: Pedido = {
    id,
    codigo: `#${id}`,
    status: "processando",
    criadoEm: agora,
    itens,
    subtotal,
    frete: { modalidade: input.frete.modalidade, valor: input.frete.valor, prazo: input.frete.prazo },
    total: arredondar(subtotal + input.frete.valor),
    comprador: input.comprador,
    endereco: input.endereco,
    pagamento: input.pagamento,
    parcelas: input.parcelas || 1,
    eventos: [{ titulo: "Pedido recebido", data: agora }],
    avaliado: false,
  }

  db.pedidos.push(pedido)
  return ok(pedido, 201)
}
