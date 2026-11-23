import { adminController } from "../../src/application/controllers/admin.controller"
import { curadoriaService } from "../../src/infrastructure/services/curadoria.service"
import { adminLogado } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/services/curadoria.service", () => ({ curadoriaService: { decidir: jest.fn() } }))
jest.mock("../../src/infrastructure/services/admin.service", () => ({ adminService: {} }))
jest.mock("../../src/infrastructure/services/indicadores.service", () => ({ indicadoresService: {} }))
jest.mock("../../src/infrastructure/services/pedidos.service", () => ({ pedidosService: {} }))

const decidir = jest.mocked(curadoriaService.decidir)

async function decidirCuradoria(tipo: string, body: unknown) {
  const res = fakeRes()
  const next = fakeNext()
  await adminController.decidirCuradoria(fakeReq({ params: { tipo, id: "p8" }, body, user: adminLogado }), res, next)
  return { res, next }
}

describe("TC05 - Decisão da curadoria sem parecer", () => {
  beforeEach(() => decidir.mockResolvedValue(undefined))

  it.each(["recusar", "ajustes"])("\"%s\" sem parecer responde 400 e não chama o service", async (decisao) => {
    const { next } = await decidirCuradoria("pecas", { decisao, parecer: "   " })

    esperarAppError(next, 400, "VALIDATION", "Escreva o parecer para pedir ajustes ou recusar.")
    expect(decidir).not.toHaveBeenCalled()
  })

  it("aprovar sem parecer é aceito e responde 204", async () => {
    const { res, next } = await decidirCuradoria("pecas", { decisao: "aprovar" })

    expect(next).not.toHaveBeenCalled()
    expect(decidir).toHaveBeenCalledWith("pecas", "p8", { decisao: "aprovar", parecer: "" }, adminLogado)
    expect(res.status).toHaveBeenCalledWith(204)
  })

  it("recusar com parecer chama o service com o parecer", async () => {
    const { res } = await decidirCuradoria("pecas", { decisao: "recusar", parecer: "Fotos desfocadas." })

    expect(decidir).toHaveBeenCalledWith("pecas", "p8", { decisao: "recusar", parecer: "Fotos desfocadas." }, adminLogado)
    expect(res.status).toHaveBeenCalledWith(204)
  })
})
