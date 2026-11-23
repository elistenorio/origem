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
  await adminController.decidirCuradoria(fakeReq({ params: { tipo, id: "a3" }, body, user: adminLogado }), res, next)
  return { res, next }
}

describe("TC05 - Obrigatoriedade de motivo na reprovação (HU-036, Cenários 2 e 3)", () => {
  beforeEach(() => decidir.mockResolvedValue(undefined))

  it("passos 1 e 2: recusar o artesão sem parecer é bloqueado com 400 e o service não é chamado", async () => {
    const { next } = await decidirCuradoria("artesaos", { decisao: "recusar", parecer: "   " })

    esperarAppError(next, 400, "VALIDATION", "Escreva o parecer para pedir ajustes ou recusar.")
    expect(decidir).not.toHaveBeenCalled()
  })

  it("passo 3: recusar com parecer chama o service com o parecer e responde 204", async () => {
    const { res } = await decidirCuradoria("artesaos", { decisao: "recusar", parecer: "Faltam fotos do processo." })

    expect(decidir).toHaveBeenCalledWith("artesaos", "a3", { decisao: "recusar", parecer: "Faltam fotos do processo." }, adminLogado)
    expect(res.status).toHaveBeenCalledWith(204)
  })
})

describe("decidirCuradoria - outras decisões", () => {
  beforeEach(() => decidir.mockResolvedValue(undefined))

  it("pedir ajustes numa peça sem parecer também responde 400", async () => {
    const { next } = await decidirCuradoria("pecas", { decisao: "ajustes" })

    esperarAppError(next, 400, "VALIDATION", "Escreva o parecer para pedir ajustes ou recusar.")
    expect(decidir).not.toHaveBeenCalled()
  })

  it("aprovar sem parecer é aceito e responde 204", async () => {
    const { res, next } = await decidirCuradoria("pecas", { decisao: "aprovar" })

    expect(next).not.toHaveBeenCalled()
    expect(decidir).toHaveBeenCalledWith("pecas", "a3", { decisao: "aprovar", parecer: "" }, adminLogado)
    expect(res.status).toHaveBeenCalledWith(204)
  })
})
