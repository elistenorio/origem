import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"
import { camposDaPeca, erroDaPeca } from "@/app/api/_lib/pecas"
import type { AtualizarEstoqueInput, ProdutoInput } from "@/types/produto"

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

// PUT /api/minha-conta/produtos/{id}: o artesão salva as mudanças de uma peça dele.
// Peça publicada ou escondida continua como está; rascunho e em análise seguem o botão, como no backend.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const input = (await request.json().catch(() => null)) as ProdutoInput | null
  const erro = erroDaPeca(input)
  if (erro || !input) return fail(400, "VALIDATION", erro ?? "Dados da peça inválidos.")

  const peca = db.produtos.find((p) => p.id === id && p.artesaoId === sessaoDemo.artesaoId)
  if (!peca) return fail(404, "NOT_FOUND", "Peça não encontrada no seu catálogo.")
  if (peca.status === "vendida") return fail(409, "CONFLICT", "Esta peça já foi vendida e não pode ser editada.")

  // Peça que já passou pela curadoria continua como está (mesma regra do backend).
  const jaAprovada = peca.status === "publicado" || peca.status === "indisponivel"
  if (jaAprovada && !input.enviarParaAnalise) {
    return fail(400, "VALIDATION", 'Esta peça já está publicada e não pode voltar a ser rascunho. Use "Salvar alterações".')
  }
  const statusAtual = peca.status
  Object.assign(peca, camposDaPeca(input))
  if (jaAprovada) peca.status = statusAtual
  return ok(peca)
}

// DELETE /api/minha-conta/produtos/{id}: apaga a peça, se ela nunca entrou em um pedido.
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const indice = db.produtos.findIndex((p) => p.id === id && p.artesaoId === sessaoDemo.artesaoId)
  if (indice === -1) return fail(404, "NOT_FOUND", "Peça não encontrada no seu catálogo.")

  const vendida = db.pedidos.some((pedido) => pedido.itens.some((item) => item.produtoId === id))
  if (vendida) {
    return fail(409, "CONFLICT", "Esta peça já foi vendida, por isso não pode ser excluída. Você pode escondê-la da vitrine em Meu estoque.")
  }

  db.produtos.splice(indice, 1)
  return new Response(null, { status: 204 })
}
