import type { Prisma, StatusPedido } from "@prisma/client"
import { prisma } from "../prisma/client"
import type { Comprador, CriarPedidoInput, Endereco, FretePedido, ItemPedido, Pedido } from "../../shared/types/pedido"

const incluirDetalhes = {
  itens: { orderBy: { id: "asc" } },
  eventos: { orderBy: [{ data: "asc" }, { id: "asc" }] },
} satisfies Prisma.PedidoInclude

type PedidoComDetalhes = Prisma.PedidoGetPayload<{ include: typeof incluirDetalhes }>

// comprador, endereco e frete são Json no banco (validados antes de gravar). O PostgreSQL (jsonb) não guarda
// a ordem das chaves, então os objetos são remontados na ordem do contrato.
function paraComprador(json: unknown): Comprador {
  const c = json as Comprador
  return { nome: c.nome, cpf: c.cpf, email: c.email, telefone: c.telefone }
}
function paraEndereco(json: unknown): Endereco {
  const e = json as Endereco
  return { cep: e.cep, rua: e.rua, numero: e.numero, complemento: e.complemento, bairro: e.bairro, cidade: e.cidade, estado: e.estado }
}
function paraFrete(json: unknown): FretePedido {
  const f = json as FretePedido
  return { modalidade: f.modalidade, valor: f.valor, prazo: f.prazo }
}

// Converte o registro do banco no formato do contrato (frontend/src/types/pedido.ts).
function paraPedido(p: PedidoComDetalhes): Pedido {
  return {
    id: p.id,
    codigo: `#${p.id}`,
    status: p.status,
    criadoEm: p.criadoEm,
    itens: p.itens.map((i) => ({
      produtoId: i.produtoId,
      titulo: i.titulo,
      imagemUrl: i.imagemUrl,
      artesaoNome: i.artesaoNome,
      precoUnitario: i.precoUnitario,
      quantidade: i.quantidade,
    })),
    subtotal: p.subtotal,
    frete: paraFrete(p.frete),
    total: p.total,
    comprador: paraComprador(p.comprador),
    endereco: paraEndereco(p.endereco),
    pagamento: p.pagamento,
    parcelas: p.parcelas,
    codigoRastreio: p.codigoRastreio ?? undefined,
    previsaoEntrega: p.previsaoEntrega ?? undefined,
    eventos: p.eventos.map((e) => ({ titulo: e.titulo, data: e.data })),
    avaliado: p.avaliado,
    motivoCancelamento: p.motivoCancelamento ?? undefined,
  }
}

// Status em que o pedido ainda pode ser cancelado (antes do envio).
export const STATUS_CANCELAVEIS = ["processando", "emSeparacao"] as const

// Erro interno usado só para desfazer a transação quando o estoque acaba no meio da compra.
class EstoqueAcabou extends Error {
  constructor(public produtoId: string) {
    super("estoque acabou")
  }
}

type DadosNovoPedido = Omit<CriarPedidoInput, "itens" | "modalidadeFrete"> & {
  itens: ItemPedido[]
  frete: FretePedido
  subtotal: number
  total: number
  usuarioId?: string
}

export const pedidosRepository = {
  async buscarPorId(id: string): Promise<{ pedido: Pedido; usuarioId: string | null } | null> {
    const registro = await prisma.pedido.findUnique({ where: { id }, include: incluirDetalhes })
    return registro ? { pedido: paraPedido(registro), usuarioId: registro.usuarioId } : null
  },

  async listar(filtros: { status?: StatusPedido }, paginacao: { skip: number; take: number }): Promise<{ itens: Pedido[]; total: number }> {
    const where: Prisma.PedidoWhereInput = { status: filtros.status }
    const [total, registros] = await prisma.$transaction([
      prisma.pedido.count({ where }),
      prisma.pedido.findMany({
        where,
        include: incluirDetalhes,
        orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
        skip: paginacao.skip,
        take: paginacao.take,
      }),
    ])
    return { itens: registros.map(paraPedido), total }
  },

  async listarAguardandoEnvioDesde(antesDe: Date): Promise<Pedido[]> {
    const registros = await prisma.pedido.findMany({
      where: { status: { in: ["processando", "emSeparacao"] }, criadoEm: { lt: antesDe } },
      include: incluirDetalhes,
      orderBy: [{ criadoEm: "asc" }, { id: "asc" }],
    })
    return registros.map(paraPedido)
  },

  async contarPorStatus(): Promise<Record<StatusPedido, number>> {
    const grupos = await prisma.pedido.groupBy({ by: ["status"], _count: { _all: true } })
    const contagem: Record<StatusPedido, number> = { processando: 0, emSeparacao: 0, enviado: 0, entregue: 0, cancelado: 0 }
    for (const grupo of grupos) contagem[grupo.status] = grupo._count._all
    return contagem
  },

  async listarComItensDoArtesao(artesaoId: string): Promise<Pedido[]> {
    const doArtesao = { produto: { artesaoId } } satisfies Prisma.ItemPedidoWhereInput
    const registros = await prisma.pedido.findMany({
      where: { itens: { some: doArtesao } },
      include: { ...incluirDetalhes, itens: { where: doArtesao, orderBy: { id: "asc" } } },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    })
    return registros.map(paraPedido)
  },

  async avancarStatus(
    id: string,
    de: StatusPedido,
    para: StatusPedido,
    dados: { evento: string; codigoRastreio?: string; previsaoEntrega?: Date },
  ): Promise<Pedido | null> {
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.pedido.updateMany({
        where: { id, status: de },
        data: { status: para, codigoRastreio: dados.codigoRastreio, previsaoEntrega: dados.previsaoEntrega },
      })
      if (count === 0) return null

      await tx.eventoPedido.create({ data: { pedidoId: id, titulo: dados.evento } })

      const registro = await tx.pedido.findUniqueOrThrow({ where: { id }, include: incluirDetalhes })
      return paraPedido(registro)
    })
  },

  /** Pedidos do usuário, do mais recente para o mais antigo. */
  async listarPorUsuario(usuarioId: string): Promise<Pedido[]> {
    const registros = await prisma.pedido.findMany({
      where: { usuarioId },
      include: incluirDetalhes,
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    })
    return registros.map(paraPedido)
  },

  /**
   * Cria o pedido e baixa o estoque de cada peça, tudo numa transação (ou tudo, ou nada).
   * A baixa só acontece "se ainda houver estoque" (updateMany com estoque >= quantidade):
   * se duas compras disputarem a última peça, só uma passa.
   * Devolve { semEstoque: produtoId } quando o estoque acabou no meio do caminho.
   */
  async criarComBaixaDeEstoque(dados: DadosNovoPedido): Promise<Pedido | { semEstoque: string }> {
    try {
      const registro = await prisma.$transaction(async (tx) => {
        for (const item of dados.itens) {
          const { count } = await tx.produto.updateMany({
            where: { id: item.produtoId, status: "publicado", estoque: { gte: item.quantidade } },
            data: { estoque: { decrement: item.quantidade } },
          })
          if (count === 0) throw new EstoqueAcabou(item.produtoId)
        }

        return tx.pedido.create({
          data: {
            status: "processando",
            subtotal: dados.subtotal,
            total: dados.total,
            frete: dados.frete,
            comprador: dados.comprador,
            endereco: dados.endereco,
            pagamento: dados.pagamento,
            parcelas: dados.parcelas,
            usuarioId: dados.usuarioId,
            itens: { create: dados.itens },
            eventos: { create: [{ titulo: "Pedido recebido" }] },
          },
          include: incluirDetalhes,
        })
      })
      return paraPedido(registro)
    } catch (err) {
      if (err instanceof EstoqueAcabou) return { semEstoque: err.produtoId }
      throw err
    }
  },

  /**
   * Cancela o pedido (se ainda estiver em processamento/separação), registra o evento e
   * devolve as peças ao estoque. Devolve null se o pedido já não podia ser cancelado.
   */
  async cancelar(id: string, motivo: string): Promise<Pedido | null> {
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.pedido.updateMany({
        where: { id, status: { in: [...STATUS_CANCELAVEIS] } },
        data: { status: "cancelado", motivoCancelamento: motivo },
      })
      if (count === 0) return null

      await tx.eventoPedido.create({ data: { pedidoId: id, titulo: "Pedido cancelado" } })

      const itens = await tx.itemPedido.findMany({ where: { pedidoId: id } })
      for (const item of itens) {
        await tx.produto.update({ where: { id: item.produtoId }, data: { estoque: { increment: item.quantidade } } })
      }

      const registro = await tx.pedido.findUniqueOrThrow({ where: { id }, include: incluirDetalhes })
      return paraPedido(registro)
    })
  },
}
