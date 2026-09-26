import { db } from "@/mocks/db"
import { ok } from "@/app/api/_lib/responses"
import type { PainelAdmin } from "@/types/admin"

// GET /api/admin/painel: tela inicial do administrador (resumo, pendências, notificações e atividades).
// Pedidos de hoje, vendas do mês e clientes são números fixos do db.json; o resto é contado a partir dos dados.
export async function GET() {
  const contarCuradoria = (tipo: string) => db.curadoria.filter((c) => c.tipo === tipo).length

  const painel: PainelAdmin = {
    resumo: {
      ...db.resumoPlataforma,
      artesaosAtivos: db.artesaos.filter((a) => a.status === "publicado").length,
      produtosPublicados: db.produtos.filter((p) => p.status === "publicado").length,
    },
    pendencias: [
      { id: "pd1", titulo: "Artesãos aguardando curadoria", quantidade: contarCuradoria("artesaos"), href: "/admin/curadoria" },
      { id: "pd2", titulo: "Peças aguardando aprovação", quantidade: contarCuradoria("pecas"), href: "/admin/curadoria" },
      {
        id: "pd3",
        titulo: "Pedidos em processamento",
        quantidade: db.pedidos.filter((p) => p.status === "processando" || p.status === "emSeparacao").length,
        href: "/admin/acompanhamento",
      },
    ],
    notificacoes: db.notificacoesAdmin,
    atividades: db.atividades,
  }
  return ok(painel)
}
