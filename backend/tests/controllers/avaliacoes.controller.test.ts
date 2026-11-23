import { avaliacoesController } from "../../src/application/controllers/avaliacoes.controller"
import { avaliacoesService } from "../../src/infrastructure/services/avaliacoes.service"
import { compradorLogado } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/services/avaliacoes.service", () => ({ avaliacoesService: { criar: jest.fn() } }))

const criar = jest.mocked(avaliacoesService.criar)

async function avaliar(body: unknown) {
  const res = fakeRes()
  const next = fakeNext()
  await avaliacoesController.criar(fakeReq({ body, user: compradorLogado }), res, next)
  return { res, next }
}

describe("TC45 - Avaliação repetida, de pedido não entregue e sem nota (HU-023, Cenários 2, 3 e 4) - validação da API", () => {
  it("passo 3: só o comentário, sem nota, responde 400 \"Dê uma nota de 1 a 5 estrelas.\"", async () => {
    const { next } = await avaliar({ pedidoId: "10500", comentario: "Gostei muito." })

    esperarAppError(next, 400, "VALIDATION", "Dê uma nota de 1 a 5 estrelas.")
    expect(criar).not.toHaveBeenCalled()
  })
})

describe("POST /avaliacoes - validação da nota", () => {
  it.each([0, 6, 4.5])("nota %s responde 400", async (nota) => {
    const { next } = await avaliar({ pedidoId: "10500", nota })

    esperarAppError(next, 400, "VALIDATION", "Dê uma nota de 1 a 5 estrelas.")
    expect(criar).not.toHaveBeenCalled()
  })

  it("nota válida chama o service e responde 201", async () => {
    criar.mockResolvedValue({ id: "av1", pedidoId: "10500", nota: 4, comentario: "", notas: {}, criadoEm: new Date() })

    const { res, next } = await avaliar({ pedidoId: "10500", nota: 4 })

    expect(next).not.toHaveBeenCalled()
    expect(criar).toHaveBeenCalledWith({ pedidoId: "10500", nota: 4, comentario: "", notas: {} }, compradorLogado)
    expect(res.status).toHaveBeenCalledWith(201)
  })
})
