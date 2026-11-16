import { AppError } from "../../shared/AppError"
import type { TokenPayload } from "../../shared/jwt"
import type { CriarPedidoInput, ItemPedido, Pedido } from "../../shared/types/pedido"
import { pedidosRepository } from "../repositories/pedidos.repository"
import { produtosRepository } from "../repositories/produtos.repository"
import { freteService } from "./frete.service"

// Valores em reais com 2 casas (evita 0.1 + 0.2 = 0.30000000000000004).
const arredondar = (valor: number) => Math.round(valor * 100) / 100

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
    return cancelado
  },

  // GET /minha-conta/pedidos
  listarDoUsuario(usuarioId: string): Promise<Pedido[]> {
    return pedidosRepository.listarPorUsuario(usuarioId)
  },
}
