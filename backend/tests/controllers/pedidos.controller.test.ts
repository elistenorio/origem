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
  itens: [{ produtoId: "p11", quantidade: 1 }],
  comprador,
  endereco,
  frete: { modalidade: "pac" },
  pagamento: "pix",
  parcelas: 1,
}

async function finalizar(body: unknown) {
  const res = fakeRes()
  const next = fakeNext()
  await pedidosController.criar(fakeReq({ body, user: compradorLogado }), res, next)
  return { res, next }
}

describe("TC40 - Conclusão de pedido sem endereço, sem forma de pagamento ou com carrinho vazio (HU-018, Cenários 2, 3 e 4) - validação da API", () => {
  it("passo 1: sem endereço de entrega responde 400 \"Informe o endereço de entrega.\"", async () => {
    const { next } = await finalizar({ ...checkout, endereco: undefined })

    esperarAppError(next, 400, "VALIDATION", "Informe o endereço de entrega.")
    expect(criar).not.toHaveBeenCalled()
  })

  it("passo 2: sem forma de pagamento responde 400 \"Escolha a forma de pagamento.\"", async () => {
    const { next } = await finalizar({ ...checkout, pagamento: undefined })

    esperarAppError(next, 400, "VALIDATION", "Escolha a forma de pagamento.")
    expect(criar).not.toHaveBeenCalled()
  })

  it("passo 3: carrinho vazio responde 400 \"O pedido precisa ter pelo menos uma peça.\"", async () => {
    const { next } = await finalizar({ ...checkout, itens: [] })

    esperarAppError(next, 400, "VALIDATION", "O pedido precisa ter pelo menos uma peça.")
    expect(criar).not.toHaveBeenCalled()
  })

  it("com todos os dados, chama o service e responde 201", async () => {
    criar.mockResolvedValue(pedidoFake())

    const { res, next } = await finalizar(checkout)

    expect(next).not.toHaveBeenCalled()
    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ pagamento: "pix", modalidadeFrete: "pac" }), compradorLogado.id)
    expect(res.status).toHaveBeenCalledWith(201)
  })
})

describe("PATCH /pedidos/:id - validações", () => {
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
