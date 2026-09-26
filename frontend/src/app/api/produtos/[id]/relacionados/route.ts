import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"

const TOTAL_RELACIONADOS = 4

// GET /api/produtos/{id}/relacionados: "Peças relacionadas" do detalhe.
// Recomendação simulada: primeiro as peças da mesma categoria, depois as outras.
// Na Avaliação 2, o módulo de recomendação assume esta rota, com o mesmo formato de resposta.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const publicados = db.produtos.filter((p) => p.status === "publicado")
  const produto = publicados.find((p) => p.id === id)

  if (!produto) return fail(404, "NOT_FOUND", "Peça não encontrada.")

  const outros = publicados.filter((p) => p.id !== produto.id)
  const relacionados = [
    ...outros.filter((p) => p.categoria === produto.categoria),
    ...outros.filter((p) => p.categoria !== produto.categoria),
  ].slice(0, TOTAL_RELACIONADOS)

  return ok(relacionados)
}
