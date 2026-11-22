import type { StatusPedido } from "@prisma/client"
import { AppError } from "../../shared/AppError"
import { adicionarDiasUteis } from "../../shared/datas"
import { arredondar } from "../../shared/dinheiro"
import type { TokenPayload } from "../../shared/jwt"
import { paginated, type Pagination } from "../../shared/pagination"
import type { Paginated } from "../../shared/types/api"
import type { AvancarPedidoInput, CriarPedidoInput, ItemPedido, Pedido, StatusAvanco } from "../../shared/types/pedido"
import { produtosCache } from "../cache/produtos.cache"
import { pedidosRepository } from "../repositories/pedidos.repository"
import { produtosRepository } from "../repositories/produtos.repository"
import { freteService } from "./frete.service"

const ROTULO_STATUS: Record<StatusPedido, string> = {
  processando: "em processamento",
  emSeparacao: "em separação",
  enviado: "enviado",
  entregue: "entregue",
  cancelado: "cancelado",
}

const PASSOS: Record<StatusAvanco, { anterior: StatusPedido; evento: string }> = {
  emSeparacao: { anterior: "processando", evento: "Pedido separado" },
  enviado: { anterior: "emSeparacao", evento: "Pedido enviado" },
  entregue: { anterior: "enviado", evento: "Pedido entregue" },
}

function maiorPrazoEmDias(prazo: string): number | undefined {
  const numeros = prazo.match(/\d+/g)
  return numeros ? Math.max(...numeros.map(Number)) : undefined
}

export const pedidosService = {
  /**
   * POST /pedidos: cria o pedido a partir do carrinho.
   * - Preço, título e artesão vêm do banco (a "foto" do momento da compra), nunca do front.
   * - O frete é recalculado pelo CEP: o front só escolhe a modalidade (PAC ou SEDEX).
   * - Baixa o estoque. Se o comprador estiver logado, o pedido fica ligado a ele.
   */
  async criar(input: CriarPedidoInput, usuarioId?: string): Promise<Pedido> {
    // Mesma peça em duas linhas do carrinho vira uma linha só, com as quantidades somadas.
    const quantidades = new Map<string, number>()
    for (const { produtoId, quantidade } of input.itens) {
      quantidades.set(produtoId, (quantidades.get(produtoId) ?? 0) + quantidade)
    }

    const produtos = await produtosRepository.buscarPublicadosPorIds([...quantidades.keys()])
    const itens: ItemPedido[] = []
    for (const [produtoId, quantidade] of quantidades) {
      const produto = produtos.find((p) => p.id === produtoId)
      if (!produto) throw new AppError(404, "NOT_FOUND", "Uma das peças do carrinho não está mais disponível.")
      if (quantidade > produto.estoque) {
        throw new AppError(409, "OUT_OF_STOCK", `Estoque insuficiente para "${produto.titulo}".`)
      }
      itens.push({
        produtoId,
        titulo: produto.titulo,
        imagemUrl: produto.imagemUrl,
        artesaoNome: produto.artesaoNome,
        precoUnitario: produto.preco,
        quantidade,
      })
    }

    const opcao = freteService.calcular(input.endereco.cep).find((o) => o.modalidade === input.modalidadeFrete)
    if (!opcao) throw new AppError(400, "VALIDATION", "Escolha uma opção de frete.")
    const frete = { modalidade: opcao.modalidade, valor: opcao.valor, prazo: opcao.prazo }

    const subtotal = arredondar(itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0))

    const resultado = await pedidosRepository.criarComBaixaDeEstoque({
      itens,
      frete,
      subtotal,
      total: arredondar(subtotal + frete.valor),
      comprador: input.comprador,
      endereco: input.endereco,
      pagamento: input.pagamento,
      parcelas: input.parcelas,
      usuarioId,
    })

    // Outra compra levou a última unidade entre a conferência acima e a gravação.
    if ("semEstoque" in resultado) {
      const titulo = itens.find((i) => i.produtoId === resultado.semEstoque)?.titulo ?? "uma das peças"
      throw new AppError(409, "OUT_OF_STOCK", `Estoque insuficiente para "${titulo}".`)
    }
    await produtosCache.invalidar() // o estoque das peças mudou
    return resultado
  },

  /**
   * PATCH /pedidos/:id (cancelar). Só o dono do pedido ou um admin.
   * Pedido de outra pessoa → 403. Só antes do envio → senão 409. Devolve as peças ao estoque.
   */
  async cancelar(id: string, motivo: string, usuario: TokenPayload): Promise<Pedido> {
    const encontrado = await pedidosRepository.buscarPorId(id)
    if (!encontrado) throw new AppError(404, "NOT_FOUND", "Pedido não encontrado.")

    const ehDono = encontrado.usuarioId === usuario.id
    if (!ehDono && usuario.perfil !== "admin") {
      throw new AppError(403, "FORBIDDEN", "Você não tem permissão para alterar este pedido.")
    }

    const cancelado = await pedidosRepository.cancelar(id, motivo)
    if (!cancelado) throw new AppError(409, "CONFLICT", "Este pedido já foi enviado e não pode mais ser cancelado.")
    await produtosCache.invalidar() // as peças voltaram ao estoque
    return cancelado
  },

  async avancar(id: string, input: AvancarPedidoInput, usuario: TokenPayload): Promise<Pedido> {
    if (usuario.perfil !== "admin") {
      throw new AppError(403, "FORBIDDEN", "Só a equipe do Origem pode atualizar o andamento do pedido.")
    }

    const encontrado = await pedidosRepository.buscarPorId(id)
    if (!encontrado) throw new AppError(404, "NOT_FOUND", "Pedido não encontrado.")

    const passo = PASSOS[input.status]
    const atual = encontrado.pedido.status
    if (atual !== passo.anterior) {
      throw new AppError(
        409,
        "CONFLICT",
        `O pedido está ${ROTULO_STATUS[atual]}; só um pedido ${ROTULO_STATUS[passo.anterior]} pode ficar ${ROTULO_STATUS[input.status]}.`,
      )
    }

    const dias = input.status === "enviado" ? maiorPrazoEmDias(encontrado.pedido.frete.prazo) : undefined
    const atualizado = await pedidosRepository.avancarStatus(id, passo.anterior, input.status, {
      evento: passo.evento,
      codigoRastreio: input.codigoRastreio,
      previsaoEntrega: dias ? adicionarDiasUteis(new Date(), dias) : undefined,
    })
    if (!atualizado) throw new AppError(409, "CONFLICT", "O pedido mudou enquanto você atualizava. Recarregue e tente de novo.")
    return atualizado
  },

  async listar(status: StatusPedido | undefined, paginacao: Pagination): Promise<Paginated<Pedido>> {
    const { itens, total } = await pedidosRepository.listar({ status }, paginacao)
    return paginated(itens, total, paginacao)
  },

  // GET /minha-conta/pedidos
  listarDoUsuario(usuarioId: string): Promise<Pedido[]> {
    return pedidosRepository.listarPorUsuario(usuarioId)
  },
}
