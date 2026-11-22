import type { Prisma } from "@prisma/client"
import { prisma } from "../prisma/client"
import { escaparLike } from "../../shared/validacao"
import type { Artesao, FiltrosArtesao, PerfilArtesao, PerfilArtesaoInput } from "../../shared/types/artesao"

// Junto com o artesão: o e-mail do usuário dele e quantas peças publicadas ele tem.
const incluirExtras = {
  usuario: { select: { email: true } },
  _count: { select: { produtos: { where: { status: "publicado" } } } },
} satisfies Prisma.ArtesaoInclude

type ArtesaoComExtras = Prisma.ArtesaoGetPayload<{ include: typeof incluirExtras }>

// Converte o registro do banco no formato do contrato (frontend/src/types/artesao.ts).
// Campos opcionais nulos viram undefined e somem do JSON, como na Fake API.
function paraArtesao(a: ArtesaoComExtras): Artesao {
  return {
    id: a.id,
    nome: a.nome,
    oficio: a.oficio,
    cidade: a.cidade,
    estado: a.estado,
    regiao: a.regiaoId,
    bio: a.bio,
    historia: a.historia,
    citacao: a.citacao,
    trabalho: a.trabalho ?? undefined,
    origemTrabalho: a.origemTrabalho ?? undefined,
    citacaoOrigem: a.citacaoOrigem ?? undefined,
    gostaDeFazer: a.gostaDeFazer ?? undefined,
    fotoUrl: a.fotoUrl,
    tecnicas: a.tecnicas,
    categorias: a.categorias,
    totalProdutos: a._count.produtos,
    email: a.usuario.email,
    status: a.status,
    criadoEm: a.criadoEm,
  }
}

const SO_PUBLICADOS = { status: "publicado" } satisfies Prisma.ArtesaoWhereInput
const ORDEM: Prisma.ArtesaoOrderByWithRelationInput[] = [{ relevancia: "desc" }, { criadoEm: "desc" }]

export const artesaosRepository = {
  /** Ids dos artesãos publicados cujo nome, cidade ou ofício contém o texto (sem acento e maiúsculas). */
  async buscarIdsPorTexto(texto: string): Promise<string[]> {
    const padrao = `%${escaparLike(texto.toLowerCase())}%`
    const linhas = await prisma.$queryRaw<{ id: string }[]>`
      SELECT a."id"
      FROM "Artesao" a
      WHERE a."status" = 'publicado'
        AND unaccent(lower(concat_ws(' ', a."nome", a."cidade", a."oficio"))) LIKE unaccent(${padrao})
    `
    return linhas.map((l) => l.id)
  },

  /**
   * Página de artesãos publicados com os filtros, mais o total.
   * `tecnicaLabel`: o artesão guarda o nome da técnica ("Renda renascença"), não o id ("renda").
   */
  async listarPublicados(
    filtros: Omit<FiltrosArtesao, "busca" | "tecnica"> & { ids?: string[]; tecnicaLabel?: string },
    paginacao: { skip: number; take: number },
  ): Promise<{ itens: Artesao[]; total: number }> {
    const where: Prisma.ArtesaoWhereInput = {
      ...SO_PUBLICADOS,
      id: filtros.ids ? { in: filtros.ids } : undefined,
      regiaoId: filtros.regiao,
      categorias: filtros.categoria ? { has: filtros.categoria } : undefined,
      tecnicas: filtros.tecnicaLabel ? { has: filtros.tecnicaLabel } : undefined,
    }

    const [total, registros] = await prisma.$transaction([
      prisma.artesao.count({ where }),
      prisma.artesao.findMany({ where, include: incluirExtras, orderBy: ORDEM, skip: paginacao.skip, take: paginacao.take }),
    ])
    return { itens: registros.map(paraArtesao), total }
  },

  /** Id do perfil de artesão ligado ao usuário logado (null se ele não tiver um). */
  async buscarIdPorUsuario(usuarioId: string): Promise<string | null> {
    const registro = await prisma.artesao.findUnique({ where: { usuarioId }, select: { id: true } })
    return registro?.id ?? null
  },

  /** Perfil do artesão ligado ao usuário logado, em qualquer status, com telefone e tempo de atuação. */
  async buscarPerfilDoUsuario(usuarioId: string): Promise<PerfilArtesao | null> {
    const registro = await prisma.artesao.findUnique({
      where: { usuarioId },
      include: { ...incluirExtras, usuario: { select: { email: true, telefone: true } } },
    })
    if (!registro) return null
    return { ...paraArtesao(registro), telefone: registro.usuario.telefone ?? "", tempoAtuacao: registro.tempoAtuacao ?? "" }
  },

  /**
   * Salva o perfil do artesão. O telefone fica no usuário; o resto, no artesão.
   * As duas gravações vão na mesma transação: ou salva tudo, ou nada.
   * Textos opcionais vazios viram null (a seção some do perfil público).
   */
  async atualizarPerfil(usuarioId: string, dados: PerfilArtesaoInput): Promise<void> {
    const ouNulo = (texto: string) => texto || null
    await prisma.$transaction([
      prisma.usuario.update({ where: { id: usuarioId }, data: { telefone: ouNulo(dados.telefone) } }),
      prisma.artesao.update({
        where: { usuarioId },
        data: {
          nome: dados.nome,
          cidade: dados.cidade,
          estado: dados.estado,
          historia: dados.historia,
          trabalho: ouNulo(dados.trabalho),
          origemTrabalho: ouNulo(dados.origemTrabalho),
          gostaDeFazer: ouNulo(dados.gostaDeFazer),
          tempoAtuacao: ouNulo(dados.tempoAtuacao),
          categorias: dados.categorias,
          tecnicas: dados.tecnicas,
        },
      }),
    ])
  },

  async buscarPublicadoPorId(id: string): Promise<Artesao | null> {
    const registro = await prisma.artesao.findFirst({ where: { id, ...SO_PUBLICADOS }, include: incluirExtras })
    return registro ? paraArtesao(registro) : null
  },

  async listarRecentes(take: number): Promise<Artesao[]> {
    const registros = await prisma.artesao.findMany({ include: incluirExtras, orderBy: [{ criadoEm: "desc" }, { id: "desc" }], take })
    return registros.map(paraArtesao)
  },
}
