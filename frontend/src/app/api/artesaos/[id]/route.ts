import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"

// GET /api/artesaos/{id}: perfil público do artesão. As peças dele vêm de GET /produtos?artesaoId={id}.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const artesao = db.artesaos.find((a) => a.id === id && a.status === "publicado")

  if (!artesao) return fail(404, "NOT_FOUND", "Artesão não encontrado.")
  return ok(artesao)
}
