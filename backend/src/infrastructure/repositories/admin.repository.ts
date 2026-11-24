import { prisma } from "../prisma/client"
import type { Atividade, Notificacao } from "../../shared/types/admin"

const LIMITE_LISTAS = 10 // notificações e atividades mais recentes

export const adminRepository = {
  /** Contagens do painel, todas de uma vez. `desde*` são os limites de "hoje" e "este mês". */
  async contar(params: { desdeHoje: Date; desdeMes: Date }) {
    const [pedidosHoje, vendas, clientes, artesaosAtivos, produtosPublicados, artesaosEmAnalise, pecasEmAnalise, pedidosEmProcessamento] =
      await prisma.$transaction([
        prisma.pedido.count({ where: { criadoEm: { gte: params.desdeHoje } } }),
        prisma.pedido.aggregate({
          _sum: { total: true },
          where: { criadoEm: { gte: params.desdeMes }, status: { not: "cancelado" } },
        }),
        prisma.usuario.count({ where: { perfil: "comprador" } }),
        prisma.artesao.count({ where: { status: "publicado" } }),
        prisma.produto.count({ where: { status: "publicado", artesao: { status: "publicado" } } }),
        prisma.artesao.count({ where: { status: "emAnalise" } }),
        prisma.produto.count({ where: { status: "emAnalise" } }),
        prisma.pedido.count({ where: { status: { in: ["processando", "emSeparacao"] } } }),
      ])

    return {
      pedidosHoje,
      vendasMes: vendas._sum.total ?? 0,
      clientes,
      artesaosAtivos,
      produtosPublicados,
      artesaosEmAnalise,
      pecasEmAnalise,
      pedidosEmProcessamento,
    }
  },

  async listarNotificacoes(): Promise<Notificacao[]> {
    return prisma.notificacao.findMany({
      select: { id: true, titulo: true, descricao: true },
      orderBy: { criadoEm: "desc" },
      take: LIMITE_LISTAS,
    })
  },

  async listarAtividades(): Promise<Atividade[]> {
    return prisma.atividade.findMany({
      select: { id: true, autor: true, descricao: true, data: true },
      orderBy: { data: "desc" },
      take: LIMITE_LISTAS,
    })
  },

  async criarAtividade(autor: string, descricao: string): Promise<void> {
    await prisma.atividade.create({ data: { autor, descricao } })
  },

  async contarAtivos() {
    const [artesaosAtivos, clientes, produtosPublicados] = await prisma.$transaction([
      prisma.artesao.count({ where: { status: "publicado" } }),
      prisma.usuario.count({ where: { perfil: "comprador" } }),
      prisma.produto.count({ where: { status: "publicado", artesao: { status: "publicado" } } }),
    ])
    return { artesaosAtivos, clientes, produtosPublicados }
  },

  async listarPedidosParaIndicadores(desde: Date) {
    return prisma.pedido.findMany({
      where: { criadoEm: { gte: desde }, status: { not: "cancelado" } },
      select: {
        criadoEm: true,
        total: true,
        itens: { select: { quantidade: true, produto: { select: { categoria: { select: { label: true } } } } } },
      },
    })
  },
}
