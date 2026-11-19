import type { Prisma } from "@prisma/client"
import { prisma } from "../prisma/client"
import { escaparLike } from "../../shared/validacao"
import type { FiltrosProduto, OrdenacaoProduto, Produto } from "../../shared/types/produto"

// Junto com cada produto vem o nome e a cidade do artesão (campos artesaoNome e cidade da resposta).
const incluirArtesao = {
  artesao: { select: { nome: true, cidade: true } },
} satisfies Prisma.ProdutoInclude

type ProdutoComArtesao = Prisma.ProdutoGetPayload<{ include: typeof incluirArtesao }>

// Converte o registro do banco no formato do contrato (frontend/src/types/produto.ts).
function paraProduto(p: ProdutoComArtesao): Produto {
  return {
    id: p.id,
    titulo: p.titulo,
    artesaoId: p.artesaoId,
    artesaoNome: p.artesao.nome,
    cidade: p.artesao.cidade,
    tags: p.tags,
    medidas: p.medidas,
    preco: p.preco,
    imagemUrl: p.imagemUrl,
    imagens: p.imagens,
    categoria: p.categoriaId,
    tecnica: p.tecnicaId,
    material: p.materialId,
    regiao: p.regiaoId,
    estoque: p.estoque,
    pecaUnica: p.pecaUnica,
    status: p.status,
    descricao: p.descricao,
    cuidados: p.cuidados,
    criadoEm: p.criadoEm,
    peso: p.peso ?? undefined,
    prazoPostagem: p.prazoPostagem ?? undefined,
    embalagem: p.embalagem ?? undefined,
  }
}

// Campos que o artesão grava ao criar ou editar uma peça, já montados pelo service.
export type DadosPeca = {
  titulo: string
  tags: string[]
  medidas: string
  preco: number
  estoque: number
  pecaUnica: boolean
  status: "rascunho" | "emAnalise"
  descricao: string
  cuidados: string
  peso: string | null
  prazoPostagem: string
  embalagem: string
  categoriaId: string
  tecnicaId: string
  materialId: string
}

// Empates sempre desempatam pela relevância, como a ordem do db.json na Fake API.
const ORDEM: Record<OrdenacaoProduto, Prisma.ProdutoOrderByWithRelationInput[]> = {
  relevancia: [{ relevancia: "desc" }, { criadoEm: "desc" }],
  menor_preco: [{ preco: "asc" }, { relevancia: "desc" }],
  maior_preco: [{ preco: "desc" }, { relevancia: "desc" }],
  recentes: [{ criadoEm: "desc" }, { relevancia: "desc" }],
}

const SO_PUBLICADOS = { status: "publicado" } satisfies Prisma.ProdutoWhereInput

export const produtosRepository = {
  /**
   * Ids das peças publicadas que contêm o texto, ignorando acentos e maiúsculas
   * ("ceramica" acha "Cerâmica"). Procura em título, artesão, cidade, categoria,
   * técnica, material (id e nome) e tags.
   * O Prisma não tem busca sem acento, então aqui vai SQL com a função unaccent do PostgreSQL.
   * O texto entra como parâmetro (${...} do $queryRaw), nunca colado no SQL: sem risco de SQL injection.
   */
  async buscarIdsPorTexto(texto: string): Promise<string[]> {
    const padrao = `%${escaparLike(texto.toLowerCase())}%`
    const linhas = await prisma.$queryRaw<{ id: string }[]>`
      SELECT p."id"
      FROM "Produto" p
      JOIN "Artesao" a ON a."id" = p."artesaoId"
      JOIN "Categoria" c ON c."id" = p."categoriaId"
      JOIN "Tecnica" t ON t."id" = p."tecnicaId"
      JOIN "Material" m ON m."id" = p."materialId"
      WHERE p."status" = 'publicado'
        AND unaccent(lower(concat_ws(' ',
              p."titulo", a."nome", a."cidade",
              c."id", c."label", t."id", t."label", m."id", m."label",
              array_to_string(p."tags", ' ')
            ))) LIKE unaccent(${padrao})
    `
    return linhas.map((l) => l.id)
  },

  /** Página de peças publicadas com os filtros, mais o total (para a paginação da tela). */
  async listarPublicados(
    filtros: Omit<FiltrosProduto, "busca"> & { ids?: string[] },
    paginacao: { skip: number; take: number },
  ): Promise<{ itens: Produto[]; total: number }> {
    const where: Prisma.ProdutoWhereInput = {
      ...SO_PUBLICADOS,
      id: filtros.ids ? { in: filtros.ids } : undefined,
      categoriaId: filtros.categoria,
      tecnicaId: filtros.tecnica,
      materialId: filtros.material,
      regiaoId: filtros.regiao,
      artesaoId: filtros.artesaoId,
      preco: { gte: filtros.precoMin, lte: filtros.precoMax },
      estoque: filtros.disponivel ? { gt: 0 } : undefined,
    }

    // As duas consultas na mesma transação: o total bate com a página.
    const [total, registros] = await prisma.$transaction([
      prisma.produto.count({ where }),
      prisma.produto.findMany({
        where,
        include: incluirArtesao,
        orderBy: ORDEM[filtros.ordenar],
        skip: paginacao.skip,
        take: paginacao.take,
      }),
    ])
    return { itens: registros.map(paraProduto), total }
  },

  async buscarPublicadoPorId(id: string): Promise<Produto | null> {
    const registro = await prisma.produto.findFirst({ where: { id, ...SO_PUBLICADOS }, include: incluirArtesao })
    return registro ? paraProduto(registro) : null
  },

  /** Peças publicadas da categoria (ou de fora dela), sem a peça `excluirId`, por relevância. */
  async listarPublicadosPorCategoria(params: {
    categoriaId: string
    mesmaCategoria: boolean
    excluirId: string
    take: number
  }): Promise<Produto[]> {
    const registros = await prisma.produto.findMany({
      where: {
        ...SO_PUBLICADOS,
        id: { not: params.excluirId },
        categoriaId: params.mesmaCategoria ? params.categoriaId : { not: params.categoriaId },
      },
      include: incluirArtesao,
      orderBy: ORDEM.relevancia,
      take: params.take,
    })
    return registros.map(paraProduto)
  },

  /** Peças publicadas com esses ids (usado ao montar um pedido). */
  async buscarPublicadosPorIds(ids: string[]): Promise<Produto[]> {
    const registros = await prisma.produto.findMany({ where: { id: { in: ids }, ...SO_PUBLICADOS }, include: incluirArtesao })
    return registros.map(paraProduto)
  },

  // ---------- Peças do artesão logado (qualquer status) ----------

  /** Todas as peças do artesão, das mais recentes para as mais antigas. */
  async listarDoArtesao(artesaoId: string): Promise<Produto[]> {
    const registros = await prisma.produto.findMany({
      where: { artesaoId },
      include: incluirArtesao,
      orderBy: [{ criadoEm: "desc" }, { relevancia: "desc" }],
    })
    return registros.map(paraProduto)
  },

  async buscarDoArtesao(id: string, artesaoId: string): Promise<Produto | null> {
    const registro = await prisma.produto.findFirst({ where: { id, artesaoId }, include: incluirArtesao })
    return registro ? paraProduto(registro) : null
  },

  async atualizarEstoqueEStatus(id: string, dados: { estoque?: number; status?: "publicado" | "indisponivel" }): Promise<Produto> {
    const registro = await prisma.produto.update({ where: { id }, data: dados, include: incluirArtesao })
    return paraProduto(registro)
  },

  /** Nova peça do artesão. A região é a dele; as fotos começam com a imagem padrão. */
  async criar(dados: DadosPeca & { artesaoId: string; regiaoId: string; imagemUrl: string }): Promise<Produto> {
    const registro = await prisma.produto.create({
      data: { ...dados, imagens: [dados.imagemUrl] },
      include: incluirArtesao,
    })
    return paraProduto(registro)
  },

  /** Edita os dados da peça. Fotos, região e relevância continuam como estavam. */
  async editar(id: string, dados: DadosPeca): Promise<Produto> {
    const registro = await prisma.produto.update({ where: { id }, data: dados, include: incluirArtesao })
    return paraProduto(registro)
  },

  /** Quantas vezes a peça aparece em pedidos (de qualquer status). */
  async contarItensPedido(id: string): Promise<number> {
    return prisma.itemPedido.count({ where: { produtoId: id } })
  },

  async excluir(id: string): Promise<void> {
    await prisma.produto.delete({ where: { id } })
  },

  /** Soma das quantidades das peças do artesão em pedidos que não foram cancelados. */
  async contarVendidasDoArtesao(artesaoId: string): Promise<number> {
    const resultado = await prisma.itemPedido.aggregate({
      _sum: { quantidade: true },
      where: { produto: { artesaoId }, pedido: { status: { not: "cancelado" } } },
    })
    return resultado._sum.quantidade ?? 0
  },
}
