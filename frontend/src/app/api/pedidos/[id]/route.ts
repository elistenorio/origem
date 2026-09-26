import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import type { CancelarPedidoInput } from "@/types/pedido"

// PATCH /api/pedidos/{id}: atualiza o pedido. Na Avaliação 1 só permite cancelar,
// e só enquanto ele ainda não foi enviado ("processando" ou "em separação").
// Altera o pedido em memória, como o PATCH da aula 06.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const input = (await request.json().catch(() => null)) as CancelarPedidoInput | null

  if (input?.status !== "cancelado") return fail(400, "VALIDATION", "Só é possível cancelar o pedido.")
  if (!input.motivo) return fail(400, "VALIDATION", "Escolha o motivo do cancelamento.")

  const pedido = db.pedidos.find((p) => p.id === id)
  if (!pedido) return fail(404, "NOT_FOUND", "Pedido não encontrado.")
  if (pedido.status !== "processando" && pedido.status !== "emSeparacao") {
    return fail(409, "CONFLICT", "Este pedido já foi enviado e não pode mais ser cancelado.")
  }

  pedido.status = "cancelado"
  pedido.motivoCancelamento = input.motivo
  pedido.eventos.push({ titulo: "Pedido cancelado", data: new Date().toISOString() })
  return ok(pedido)
}
