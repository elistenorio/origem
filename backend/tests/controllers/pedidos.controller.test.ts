import { pedidosController } from "../../src/application/controllers/pedidos.controller"
import { pedidosService } from "../../src/infrastructure/services/pedidos.service"
import { adminLogado, compradorLogado, pedidoFake } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/services/pedidos.service", () => ({
  pedidosService: { criar: jest.fn(), cancelar: jest.fn(), avancar: jest.fn() },
}))

const criar = jest.mocked(pedidosService.criar)
const cancelar = jest.mocked(pedidosService.cancelar)
const avancar = jest.mocked(pedidosService.avancar)

const { comprador, endereco } = pedidoFake()
const checkout = {
  itens: [{ produtoId: "p3", quantidade: 1 }],
  comprador,
  endereco,
  frete: { modalidade: "pac" },
  pagamento: "pix",
  parcelas: 1,
}

describe("TC40 - Checkout com dados obrigatórios faltando (passo 2: API)", () => {
  it("sem forma de pagamento responde 400 \"Escolha a forma de pagamento.\"", async () => {
    const next = fakeNext()
    await pedidosController.criar(fakeReq({ body: { ...checkout, pagamento: undefined } }), fakeRes(), next)

    esperarAppError(next, 400, "VALIDATION", "Escolha a forma de pagamento.")
    expect(criar).not.toHaveBeenCalled()
  })

  it("com todos os dados chama o service e responde 201", async () => {
    criar.mockResolvedValue(pedidoFake())
    const res = fakeRes()
    const next = fakeNext()
    await pedidosController.criar(fakeReq({ body: checkout, user: compradorLogado }), res, next)

    expect(next).not.toHaveBeenCalled()
    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ pagamento: "pix", modalidadeFrete: "pac" }), compradorLogado.id)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("cancelar sem motivo responde 400", async () => {
    const next = fakeNext()
    await pedidosController.atualizar(fakeReq({ params: { id: "10500" }, body: { status: "cancelado" }, user: compradorLogado }), fakeRes(), next)

    esperarAppError(next, 400, "VALIDATION", "Escolha o motivo do cancelamento.")
    expect(cancelar).not.toHaveBeenCalled()
  })

  it("marcar como enviado sem código de rastreio responde 400", async () => {
    const next = fakeNext()
    await pedidosController.atualizar(fakeReq({ params: { id: "10500" }, body: { status: "enviado" }, user: adminLogado }), fakeRes(), next)

    esperarAppError(next, 400, "VALIDATION", "Informe o código de rastreio.")
    expect(avancar).not.toHaveBeenCalled()
  })
})
