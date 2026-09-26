import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"
import type { AtualizarEstoqueInput } from "@/types/produto"

// PATCH /api/minha-conta/produtos/{id}: o artesão logado atualiza o estoque de uma peça dele
// e/ou esconde ("indisponivel") e mostra de novo ("publicado") a peça na vitrine.
// Altera a peça em memória, como o PATCH da aula 06.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const input = (await request.json().catch(() => null)) as AtualizarEstoqueInput | null

  if (!input || (input.estoque === undefined && input.status === undefined)) {
    return fail(400, "VALIDATION", "Informe o estoque ou o status da peça.")
  }
  if (input.estoque !== undefined && (!Number.isInteger(input.estoque) || input.estoque < 0)) {
    return fail(400, "VALIDATION", "O estoque precisa ser um número inteiro, zero ou maior.")
  }
  if (input.status !== undefined && input.status !== "publicado" && input.status !== "indisponivel") {
    return fail(400, "VALIDATION", "Status inválido.")
  }

  const peca = db.produtos.find((p) => p.id === id && p.artesaoId === sessaoDemo.artesaoId)
  if (!peca) return fail(404, "NOT_FOUND", "Peça não encontrada no seu catálogo.")

  // Esconder/mostrar só vale para peças que já passaram pela curadoria.
  if (input.status && peca.status !== "publicado" && peca.status !== "indisponivel") {
    return fail(409, "CONFLICT", "Só é possível esconder ou mostrar peças já publicadas.")
  }

  if (input.estoque !== undefined) peca.estoque = input.estoque
  if (input.status) peca.status = input.status
  return ok(peca)
}
