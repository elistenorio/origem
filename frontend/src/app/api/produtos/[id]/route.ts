import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"

// GET /api/produtos/{id}: detalhe de uma peça publicada.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const produto = db.produtos.find((p) => p.id === id && p.status === "publicado")

  if (!produto) return fail(404, "NOT_FOUND", "Peça não encontrada.")
  return ok(produto)
}
