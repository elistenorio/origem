import { db } from "@/mocks/db"
import { ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"

// GET /api/minha-conta/produtos: todas as peças do artesão logado (na Avaliação 1, o de demonstração),
// em qualquer status (publicada, em análise, rascunho, indisponível), das mais recentes para as mais antigas.
// Usada por "Meu catálogo" e "Estoque". Busca e filtros dessas telas são feitos na própria tela.
export async function GET() {
  const pecas = db.produtos
    .filter((p) => p.artesaoId === sessaoDemo.artesaoId)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  return ok(pecas)
}
