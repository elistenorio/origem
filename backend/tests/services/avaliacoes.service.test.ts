import { avaliacoesRepository } from "../../src/infrastructure/repositories/avaliacoes.repository"
import { pedidosRepository } from "../../src/infrastructure/repositories/pedidos.repository"
import { avaliacoesService } from "../../src/infrastructure/services/avaliacoes.service"
import { compradorLogado, outroComprador, pedidoEncontrado } from "../helpers/fixtures"

jest.mock("../../src/infrastructure/repositories/avaliacoes.repository", () => ({ avaliacoesRepository: { criar: jest.fn() } }))
jest.mock("../../src/infrastructure/repositories/pedidos.repository", () => ({ pedidosRepository: { buscarPorId: jest.fn() } }))

const buscarPorId = jest.mocked(pedidosRepository.buscarPorId)
const criarAvaliacao = jest.mocked(avaliacoesRepository.criar)

const input = { pedidoId: "10402", nota: 5, comentario: "Peça linda, superou minhas expectativas", notas: {} }

describe("TC44 - Avaliação de peça com pedido entregue (HU-023, Cenário 1)", () => {
  it("o dono avalia o pedido entregue e a avaliação é registrada", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "entregue" }))
    criarAvaliacao.mockResolvedValue({ ...input, id: "av1", criadoEm: new Date() })

    await expect(avaliacoesService.criar(input, compradorLogado)).resolves.toMatchObject({ id: "av1", nota: 5 })
    expect(criarAvaliacao).toHaveBeenCalledWith(input)
  })
})

describe("TC45 - Avaliação repetida, de pedido não entregue e sem nota (HU-023, Cenários 2, 3 e 4)", () => {
  it("passo 1: pedido já avaliado responde 409 \"Este pedido já foi avaliado.\"", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "entregue", avaliado: true }))

    await expect(avaliacoesService.criar(input, compradorLogado)).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "Este pedido já foi avaliado.",
    })
    expect(criarAvaliacao).not.toHaveBeenCalled()
  })

  it("passo 2: pedido em separação responde 409 \"Só é possível avaliar pedidos entregues.\"", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "emSeparacao" }))

    await expect(avaliacoesService.criar({ ...input, pedidoId: "10495" }, compradorLogado)).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "Só é possível avaliar pedidos entregues.",
    })
    expect(criarAvaliacao).not.toHaveBeenCalled()
  })
})

describe("avaliacoesService.criar - outras regras", () => {
  it("pedido de outra pessoa responde 403", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "entregue" }))

    await expect(avaliacoesService.criar(input, outroComprador)).rejects.toMatchObject({ status: 403, code: "FORBIDDEN" })
    expect(criarAvaliacao).not.toHaveBeenCalled()
  })

  it("outro envio avaliou o mesmo pedido no meio do caminho: 409", async () => {
    buscarPorId.mockResolvedValue(pedidoEncontrado({ status: "entregue" }))
    criarAvaliacao.mockResolvedValue(null)

    await expect(avaliacoesService.criar(input, compradorLogado)).rejects.toMatchObject({ status: 409, code: "CONFLICT" })
  })
})
