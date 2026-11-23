import type { DecisaoCuradoria, StatusArtesao, StatusProduto, TipoCuradoria } from "@prisma/client"
import { prisma } from "../prisma/client"

type Decisao = {
  tipo: TipoCuradoria
  itemId: string
  decisao: DecisaoCuradoria
  status: StatusArtesao & StatusProduto
  parecer: string
  autor: string
  atividade: string
}

export const curadoriaRepository = {
  listarArtesaosEmAnalise() {
    return prisma.artesao.findMany({
      where: { status: "emAnalise" },
      select: { id: true, nome: true, oficio: true, cidade: true, estado: true, bio: true, historia: true, fotoUrl: true, criadoEm: true, comprovacoes: true },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    })
  },

  listarPecasEmAnalise() {
    return prisma.produto.findMany({
      where: { status: "emAnalise" },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        medidas: true,
        preco: true,
        imagemUrl: true,
        imagens: true,
        criadoEm: true,
        artesao: { select: { nome: true } },
        tecnica: { select: { label: true } },
      },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    })
  },

  listarAnalises(tipo: TipoCuradoria, itemIds: string[]) {
    return prisma.analiseCuradoria.findMany({
      where: { tipo, itemId: { in: itemIds } },
      orderBy: [{ data: "asc" }, { id: "asc" }],
    })
  },

  async buscarItem(tipo: TipoCuradoria, id: string): Promise<{ nome: string; status: string } | null> {
    if (tipo === "artesaos") {
      return prisma.artesao.findUnique({ where: { id }, select: { nome: true, status: true } })
    }
    const peca = await prisma.produto.findUnique({ where: { id }, select: { titulo: true, status: true } })
    return peca ? { nome: peca.titulo, status: peca.status } : null
  },

  async decidir(d: Decisao): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const where = { id: d.itemId, status: "emAnalise" as const }
      const data = { status: d.status, parecerCuradoria: d.decisao === "aprovar" ? null : d.parecer }
      const { count } =
        d.tipo === "artesaos" ? await tx.artesao.updateMany({ where, data }) : await tx.produto.updateMany({ where, data })
      if (count === 0) return false

      await tx.analiseCuradoria.create({
        data: { tipo: d.tipo, itemId: d.itemId, decisao: d.decisao, parecer: d.parecer, autor: d.autor },
      })
      await tx.atividade.create({ data: { autor: d.autor, descricao: d.atividade } })
      return true
    })
  },

  async listarDecisoesDoArtesao(artesaoId: string, produtoIds: string[]) {
    return prisma.analiseCuradoria.findMany({
      where: { OR: [{ tipo: "artesaos", itemId: artesaoId }, { tipo: "pecas", itemId: { in: produtoIds } }] },
      orderBy: [{ data: "desc" }, { id: "desc" }],
    })
  },
}
