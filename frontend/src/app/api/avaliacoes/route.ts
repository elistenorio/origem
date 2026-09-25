import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import type { Avaliacao, CriarAvaliacaoInput } from "@/types/avaliacao"

// POST /api/avaliacoes: avaliação de um pedido entregue ("Avaliar o pedido" em Meus pedidos).
// Guardada só em memória, como os pedidos.
export async function POST(request: NextRequest) {
  const input = (await request.json().catch(() => null)) as CriarAvaliacaoInput | null

  if (!input || !Number.isInteger(input.nota) || input.nota < 1 || input.nota > 5) {
    return fail(400, "VALIDATION", "Dê uma nota de 1 a 5 estrelas.")
  }

  const pedido = db.pedidos.find((p) => p.id === input.pedidoId)
  if (!pedido) return fail(404, "NOT_FOUND", "Pedido não encontrado.")
  if (pedido.status !== "entregue") return fail(409, "CONFLICT", "Só é possível avaliar pedidos entregues.")
  if (pedido.avaliado) return fail(409, "CONFLICT", "Este pedido já foi avaliado.")

  const avaliacao: Avaliacao = {
    id: `av${db.avaliacoes.length + 1}`,
    pedidoId: pedido.id,
    nota: input.nota,
    comentario: input.comentario ?? "",
    notas: input.notas ?? {},
    criadoEm: new Date().toISOString(),
  }

  db.avaliacoes.push(avaliacao)
  pedido.avaliado = true
  return ok(avaliacao, 201)
}
