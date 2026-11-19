import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"
import { camposDaPeca, erroDaPeca, FOTO_PADRAO_PECA } from "@/app/api/_lib/pecas"
import type { Produto, ProdutoInput } from "@/types/produto"

// GET /api/minha-conta/produtos: todas as peças do artesão logado (na Avaliação 1, o de demonstração),
// em qualquer status (publicada, em análise, rascunho, indisponível), das mais recentes para as mais antigas.
// Usada por "Meu catálogo" e "Estoque". Busca e filtros dessas telas são feitos na própria tela.
export async function GET() {
  const pecas = db.produtos
    .filter((p) => p.artesaoId === sessaoDemo.artesaoId)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  return ok(pecas)
}

// POST /api/minha-conta/produtos: o artesão logado cadastra uma peça nova (rascunho ou enviada
// para a curadoria). Guarda em memória, como o POST da aula 06.
export async function POST(request: NextRequest) {
  const input = (await request.json().catch(() => null)) as ProdutoInput | null
  const erro = erroDaPeca(input)
  if (erro || !input) return fail(400, "VALIDATION", erro ?? "Dados da peça inválidos.")

  const artesao = db.artesaos.find((a) => a.id === sessaoDemo.artesaoId)
  if (!artesao) return fail(404, "NOT_FOUND", "Perfil de artesão não encontrado.")

  const peca: Produto = {
    ...camposDaPeca(input),
    id: `p-${Date.now()}`,
    artesaoId: artesao.id,
    artesaoNome: artesao.nome,
    cidade: artesao.cidade,
    regiao: artesao.regiao,
    imagemUrl: FOTO_PADRAO_PECA,
    imagens: [FOTO_PADRAO_PECA],
    criadoEm: new Date().toISOString(),
  }
  db.produtos.push(peca)
  return ok(peca, 201)
}
