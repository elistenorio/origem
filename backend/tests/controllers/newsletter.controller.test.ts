import { newsletterController } from "../../src/application/controllers/newsletter.controller"
import { newsletterService } from "../../src/infrastructure/services/newsletter.service"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/services/newsletter.service", () => ({
  newsletterService: { assinar: jest.fn() },
}))

const assinar = jest.mocked(newsletterService.assinar)

async function enviar(body: unknown) {
  const res = fakeRes()
  const next = fakeNext()
  await newsletterController.assinar(fakeReq({ body }), res, next)
  return { res, next }
}

describe("POST /newsletter: assinatura da newsletter", () => {
  beforeEach(() => assinar.mockResolvedValue({ nome: "Ana", email: "ana@exemplo.com" }))
  afterEach(() => jest.clearAllMocks())

  it("assina com nome, e-mail e aceite, e responde 201 com o que foi salvo", async () => {
    const { res, next } = await enviar({ nome: " Ana ", email: "Ana@Exemplo.com", aceitouTermos: true })

    expect(next).not.toHaveBeenCalled()
    expect(assinar).toHaveBeenCalledWith("Ana", "Ana@Exemplo.com")
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ nome: "Ana", email: "ana@exemplo.com" })
  })

  it("sem nome responde 400 VALIDATION", async () => {
    const { next } = await enviar({ nome: " ", email: "ana@exemplo.com", aceitouTermos: true })
    esperarAppError(next, 400, "VALIDATION", "Informe seu nome.")
    expect(assinar).not.toHaveBeenCalled()
  })

  it("com e-mail inválido responde 400 VALIDATION", async () => {
    const { next } = await enviar({ nome: "Ana", email: "ana@exemplo", aceitouTermos: true })
    esperarAppError(next, 400, "VALIDATION", "Informe um e-mail válido.")
    expect(assinar).not.toHaveBeenCalled()
  })

  it("sem o aceite responde 400 VALIDATION", async () => {
    const { next } = await enviar({ nome: "Ana", email: "ana@exemplo.com" })
    esperarAppError(next, 400, "VALIDATION", "Marque que aceita receber e-mails para assinar.")
    expect(assinar).not.toHaveBeenCalled()
  })
})
