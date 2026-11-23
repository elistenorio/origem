import { usuariosController } from "../../src/application/controllers/usuarios.controller"
import { usuariosService } from "../../src/infrastructure/services/usuarios.service"
import { usuarioFake } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/services/usuarios.service", () => ({
  usuariosService: { cadastrarComprador: jest.fn(), cadastrarArtesao: jest.fn() },
}))

const cadastrarComprador = jest.mocked(usuariosService.cadastrarComprador)

async function cadastrar(body: unknown) {
  const res = fakeRes()
  const next = fakeNext()
  await usuariosController.cadastrar(fakeReq({ body }), res, next)
  return { res, next }
}

const nome = "Joana Ferreira"

describe("TC25 - Cadastro sem campo obrigatório e com senha fora das regras (HU-001, Cenários 3, 4 e 5)", () => {
  beforeEach(() => cadastrarComprador.mockResolvedValue(usuarioFake()))

  it("passo 1: sem e-mail responde 400 VALIDATION", async () => {
    const { next } = await cadastrar({ nome, senha: "Senha#12" })

    esperarAppError(next, 400, "VALIDATION", "Informe um e-mail válido.")
    expect(cadastrarComprador).not.toHaveBeenCalled()
  })

  it.each([
    ["2", "Se#1"],
    ["3", "Senha#1"],
  ])("passo %s: senha \"%s\" responde 400 \"A senha precisa ter pelo menos 8 caracteres.\"", async (_passo, senha) => {
    const { next } = await cadastrar({ nome, email: "joana.ferreira@exemplo.com", senha })

    esperarAppError(next, 400, "VALIDATION", "A senha precisa ter pelo menos 8 caracteres.")
    expect(cadastrarComprador).not.toHaveBeenCalled()
  })

  it("passo 4: senha \"Senha#12\", no limite de 8 caracteres, cria a conta com 201", async () => {
    const corpo = { nome, email: "limite.senha@exemplo.com", senha: "Senha#12" }
    const { res, next } = await cadastrar(corpo)

    expect(next).not.toHaveBeenCalled()
    expect(cadastrarComprador).toHaveBeenCalledWith(corpo)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("passo 5: senha \"SenhaForte2026\", sem caractere especial, responde 400 VALIDATION", async () => {
    const { next } = await cadastrar({ nome, email: "sem.especial@exemplo.com", senha: "SenhaForte2026" })

    esperarAppError(next, 400, "VALIDATION")
    expect(cadastrarComprador).not.toHaveBeenCalled()
  })
})
