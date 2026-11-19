import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"
import type { PerfilArtesao, PerfilArtesaoInput } from "@/types/artesao"

// Telefone e tempo de atuação não estão no db.json: a Fake API guarda aqui, em memória.
const extras = { telefone: "", tempoAtuacao: "" }

function perfilDemo(): PerfilArtesao | undefined {
  const artesao = db.artesaos.find((a) => a.id === sessaoDemo.artesaoId)
  return artesao ? { ...artesao, ...extras } : undefined
}

// GET /api/minha-conta/perfil: perfil do artesão logado (na Avaliação 1, o de demonstração).
export async function GET() {
  const perfil = perfilDemo()
  if (!perfil) return fail(404, "NOT_FOUND", "Perfil de artesão não encontrado.")
  return ok(perfil)
}

// PUT /api/minha-conta/perfil: salva o perfil. Mesmas validações do backend.
export async function PUT(request: NextRequest) {
  const input = (await request.json().catch(() => null)) as PerfilArtesaoInput | null
  if (!input?.nome?.trim()) return fail(400, "VALIDATION", "Informe o nome que vai aparecer no Origem.")
  if (!input.cidade?.trim()) return fail(400, "VALIDATION", "Informe sua cidade.")
  if (!/^[A-Za-z]{2}$/.test(input.estado?.trim() ?? "")) return fail(400, "VALIDATION", "Informe o estado com 2 letras (ex.: PE).")
  if (!input.historia?.trim()) return fail(400, "VALIDATION", "Conte um pouco da sua história.")
  if (input.telefone && input.telefone.replace(/\D/g, "").length < 10) return fail(400, "VALIDATION", "Informe o telefone com DDD.")
  if (!input.categorias?.length) return fail(400, "VALIDATION", "Escolha sua área de atuação.")

  const artesao = db.artesaos.find((a) => a.id === sessaoDemo.artesaoId)
  if (!artesao) return fail(404, "NOT_FOUND", "Perfil de artesão não encontrado.")

  // Textos opcionais vazios somem do perfil público (como no backend).
  const ouUndefined = (texto: string) => texto.trim() || undefined
  Object.assign(artesao, {
    nome: input.nome.trim(),
    cidade: input.cidade.trim(),
    estado: input.estado.trim().toUpperCase(),
    historia: input.historia.trim(),
    trabalho: ouUndefined(input.trabalho),
    origemTrabalho: ouUndefined(input.origemTrabalho),
    gostaDeFazer: ouUndefined(input.gostaDeFazer),
    categorias: input.categorias,
    tecnicas: input.tecnicas,
  })
  extras.telefone = input.telefone.trim()
  extras.tempoAtuacao = input.tempoAtuacao
  return ok(perfilDemo())
}
