import { produtosCache } from "../../src/infrastructure/cache/produtos.cache"
import { pedidosRepository } from "../../src/infrastructure/repositories/pedidos.repository"
import { produtosRepository } from "../../src/infrastructure/repositories/produtos.repository"
import { pedidosService } from "../../src/infrastructure/services/pedidos.service"
import type { CriarPedidoInput } from "../../src/shared/types/pedido"
import { adminLogado, compradorLogado, outroComprador, pedidoEncontrado, pedidoFake, produtoFake } from "../helpers/fixtures"

jest.mock("../../src/infrastructure/repositories/pedidos.repository", () => ({
  pedidosRepository: { buscarPorId: jest.fn(), cancelar: jest.fn(), avancarStatus: jest.fn(), criarComBaixaDeEstoque: jest.fn() },
}))
jest.mock("../../src/infrastructure/repositories/produtos.repository", () => ({
  produtosRepository: { buscarPublicadosPorIds: jest.fn() },
}))
jest.mock("../../src/infrastructure/cache/produtos.cache", () => ({ produtosCache: { invalidar: jest.fn() } }))

const buscarPublicadosPorIds = jest.mocked(produtosRepository.buscarPublicadosPorIds)
const criarComBaixaDeEstoque = jest.mocked(pedidosRepository.criarComBaixaDeEstoque)
const buscarPorId = jest.mocked(pedidosRepository.buscarPorId)
const cancelar = jest.mocked(pedidosRepository.cancelar)
const avancarStatus = jest.mocked(pedidosRepository.avancarStatus)
const invalidarCache = jest.mocked(produtosCache.invalidar)

function novoPedido(itens: CriarPedidoInput["itens"]): CriarPedidoInput {
  const { comprador, endereco } = pedidoFake()
  return { itens, comprador, endereco, modalidadeFrete: "pac", pagamento: "pix", parcelas: 1 }
}

describe("TC01 e TC02 - Compra com estoque insuficiente (nível componente)", () => {
  it("quantidade maior que o estoque responde 409 OUT_OF_STOCK sem gravar o pedido", async () => {
    buscarPublicadosPorIds.mockResolvedValue([produtoFake({ estoque: 1 })])

    await expect(pedidosService.criar(novoPedido([{ produtoId: "p3", quantidade: 2 }]))).rejects.toMatchObject({
      status: 409,
      code: "OUT_OF_STOCK",
      message: "Estoque insuficiente para \"Conj. Brasileiro\".",
    })
    expect(criarComBaixaDeEstoque).not.toHaveBeenCalled()
  })

  it("outra compra levou a última unidade antes da gravação: também responde 409 OUT_OF_STOCK", async () => {
    buscarPublicadosPorIds.mockResolvedValue([produtoFake({ estoque: 1 })])
    criarComBaixaDeEstoque.mockResolvedValue({ semEstoque: "p3" })

    await expect(pedidosService.criar(novoPedido([{ produtoId: "p3", quantidade: 1 }]))).rejects.toMatchObject({
      status: 409,
      code: "OUT_OF_STOCK",
      message: "Estoque insuficiente para \"Conj. Brasileiro\".",
    })
    expect(invalidarCache).not.toHaveBeenCalled()
  })
})

describe("TC39 - Valores do pedido calculados pelo backend", () => {
  beforeEach(() => {
    buscarPublicadosPorIds.mockResolvedValue([produtoFake({ preco: 167.9, estoque: 6 })])
    criarComBaixaDeEstoque.mockResolvedValue(pedidoFake())
  })

  it("grava o preço que está no banco, não um valor vindo da requisição", async () => {
    const input = novoPedido([{ produtoId: "p3", quantidade: 1 }])
    Object.assign(input.itens[0], { precoUnitario: 0.01 })

    await pedidosService.criar(input)

    expect(criarComBaixaDeEstoque.mock.calls[0][0].itens[0].precoUnitario).toBe(167.9)
  })

  it("a mesma peça em duas linhas vira uma linha com as quantidades somadas", async () => {
    await pedidosService.criar(novoPedido([{ produtoId: "p3", quantidade: 1 }, { produtoId: "p3", quantidade: 2 }]))

    const { itens } = criarComBaixaDeEstoque.mock.calls[0][0]
    expect(itens).toHaveLength(1)
    expect(itens[0]).toMatchObject({ produtoId: "p3", quantidade: 3 })
  })

  it("total = subtotal + frete calculado pelo CEP", async () => {
    await pedidosService.criar(novoPedido([{ produtoId: "p3", quantidade: 2 }]))

    const dados = criarComBaixaDeEstoque.mock.calls[0][0]
    expect(dados.subtotal).toBe(335.8)
    expect(dados.frete).toEqual({ modalidade: "pac", valor: 18.9, prazo: "6 a 8 dias úteis" })
    expect(dados.total).toBe(354.7)
  })

  it("invalida o cache da vitrine depois de baixar o estoque", async () => {
    await pedidosService.criar(novoPedido([{ produtoId: "p3", quantidade: 1 }]))

    expect(invalidarCache).toHaveBeenCalledTimes(1)
  })

  it("peça que não está publicada responde 404", async () => {
    buscarPublicadosPorIds.mockResolvedValue([])

    await expect(pedidosService.criar(novoPedido([{ produtoId: "p8", quantidade: 1 }]))).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    })
    expect(criarComBaixaDeEstoque).not.toHaveBeenCalled()
  })
})

describe("TC42 - Cancelamento do pedido por quem tem permissão", () => {
  beforeEach(() => cancelar.mockResolvedValue(pedidoFake({ status: "cancelado" })))

  it("o dono cancela, as peças voltam ao estoque e o cache é invalidado", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado())

    await expect(pedidosService.cancelar("10500", "Desisti da compra", compradorLogado)).resolves.toMatchObject({ status: "cancelado" })
    expect(cancelar).toHaveBeenCalledWith("10500", "Desisti da compra")
    expect(invalidarCache).toHaveBeenCalledTimes(1)
  })

  it("o admin pode cancelar o pedido de outra pessoa", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado())

    await pedidosService.cancelar("10500", "Pagamento não confirmado", adminLogado)

    expect(cancelar).toHaveBeenCalledWith("10500", "Pagamento não confirmado")
  })

  it("outro comprador recebe 403 e nada é cancelado", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado())

    await expect(pedidosService.cancelar("10500", "Desisti", outroComprador)).rejects.toMatchObject({ status: 403, code: "FORBIDDEN" })
    expect(cancelar).not.toHaveBeenCalled()
  })
})

describe("TC43 - Cancelamento de pedido já enviado", () => {
  it("o repository não cancela (pedido já enviado) e o service responde 409", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "enviado" }))
    cancelar.mockResolvedValue(null)

    await expect(pedidosService.cancelar("10500", "Desisti", compradorLogado)).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "Este pedido já foi enviado e não pode mais ser cancelado.",
    })
    expect(invalidarCache).not.toHaveBeenCalled()
  })
})

describe("TC50 - Andamento do pedido atualizado pelo admin", () => {
  afterEach(() => jest.useRealTimers())

  it("quem não é admin recebe 403", async () => {
    await expect(pedidosService.avancar("10500", { status: "emSeparacao" }, compradorLogado)).rejects.toMatchObject({
      status: 403,
      code: "FORBIDDEN",
    })
    expect(buscarPorId).not.toHaveBeenCalled()
  })

  it("processando vai para emSeparacao", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "processando" }))
    avancarStatus.mockResolvedValue(pedidoFake({ status: "emSeparacao" }))

    await expect(pedidosService.avancar("10500", { status: "emSeparacao" }, adminLogado)).resolves.toMatchObject({ status: "emSeparacao" })
    expect(avancarStatus).toHaveBeenCalledWith("10500", "processando", "emSeparacao", {
      evento: "Pedido separado",
      codigoRastreio: undefined,
      previsaoEntrega: undefined,
    })
  })

  it("marcar como enviado grava o rastreio e calcula a previsão pelo maior prazo do frete, em dias úteis", async () => {
    jest.useFakeTimers({ now: new Date("2026-11-20T15:00:00Z") })
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "emSeparacao" }))
    avancarStatus.mockResolvedValue(pedidoFake({ status: "enviado" }))

    await pedidosService.avancar("10500", { status: "enviado", codigoRastreio: "BR123456789BR" }, adminLogado)

    expect(avancarStatus).toHaveBeenCalledWith("10500", "emSeparacao", "enviado", {
      evento: "Pedido enviado",
      codigoRastreio: "BR123456789BR",
      previsaoEntrega: new Date("2026-12-02T15:00:00Z"),
    })
  })
})

describe("TC51 - Andamento fora da ordem", () => {
  it("pedido enviado não pode voltar para emSeparacao: 409", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "enviado" }))

    await expect(pedidosService.avancar("10500", { status: "emSeparacao" }, adminLogado)).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "O pedido está enviado; só um pedido em processamento pode ficar em separação.",
    })
    expect(avancarStatus).not.toHaveBeenCalled()
  })
})
