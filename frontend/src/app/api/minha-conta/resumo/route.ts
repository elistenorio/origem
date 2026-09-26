import { db } from "@/mocks/db"
import { ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"
import { LIMITE_BAIXO_ESTOQUE } from "@/constants/pedidos"
import type { ResumoPainelArtesao } from "@/types/artesao"

// GET /api/minha-conta/resumo: números do topo de "Meu catálogo" e "Estoque" do artesão logado.
export async function GET() {
  const minhas = db.produtos.filter((p) => p.artesaoId === sessaoDemo.artesaoId)
  const doCatalogo = (status: string) => minhas.filter((p) => p.status === status).length

  // Peças vendidas: soma das quantidades das minhas peças em pedidos que não foram cancelados.
  const vendidas = db.pedidos
    .filter((pedido) => pedido.status !== "cancelado")
    .flatMap((pedido) => pedido.itens)
    .filter((item) => minhas.some((p) => p.id === item.produtoId))
    .reduce((soma, item) => soma + item.quantidade, 0)

  // Estoque: só conta as peças que estão ou estiveram na vitrine (publicadas ou escondidas).
  const ativas = minhas.filter((p) => p.status === "publicado" || p.status === "indisponivel")

  const resumo: ResumoPainelArtesao = {
    catalogo: {
      publicadas: doCatalogo("publicado"),
      emAnalise: doCatalogo("emAnalise"),
      vendidas,
      indisponiveis: doCatalogo("indisponivel"),
    },
    estoque: {
      disponiveis: ativas.filter((p) => p.estoque > LIMITE_BAIXO_ESTOQUE).length,
      baixoEstoque: ativas.filter((p) => p.estoque > 0 && p.estoque <= LIMITE_BAIXO_ESTOQUE).length,
      esgotadas: ativas.filter((p) => p.estoque === 0).length,
    },
  }
  return ok(resumo)
}
