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

const valido = { nome: "Ana Beatriz Souza", email: "ana.beatriz@email.com" }

describe("TC25 - Cadastro com e-mail ou senha inválidos (HU-001)", () => {
  beforeEach(() => cadastrarComprador.mockResolvedValue(usuarioFake()))

  it("sem e-mail responde 400 VALIDATION", async () => {
    const { next } = await cadastrar({ nome: valido.nome, senha: "Senha#12" })

    esperarAppError(next, 400, "VALIDATION", "Informe um e-mail válido.")
    expect(cadastrarComprador).not.toHaveBeenCalled()
  })

  it.each(["Se#1", "Senha#1"])("senha curta \"%s\" responde 400 VALIDATION", async (senha) => {
    const { next } = await cadastrar({ ...valido, senha })

    esperarAppError(next, 400, "VALIDATION", "A senha precisa ter pelo menos 8 caracteres.")
    expect(cadastrarComprador).not.toHaveBeenCalled()
  })

  it("senha \"Senha#12\", no limite de 8 caracteres, cria a conta com 201", async () => {
    const { res, next } = await cadastrar({ ...valido, senha: "Senha#12" })

    expect(next).not.toHaveBeenCalled()
    expect(cadastrarComprador).toHaveBeenCalledWith({ ...valido, senha: "Senha#12" })
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it("senha \"SenhaForte2026\", sem caractere especial, responde 400 VALIDATION", async () => {
    const { next } = await cadastrar({ ...valido, senha: "SenhaForte2026" })

    esperarAppError(next, 400, "VALIDATION")
    expect(cadastrarComprador).not.toHaveBeenCalled()
  })
})
