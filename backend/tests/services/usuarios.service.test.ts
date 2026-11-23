import bcrypt from "bcryptjs"
import { usuariosRepository } from "../../src/infrastructure/repositories/usuarios.repository"
import { usuariosService } from "../../src/infrastructure/services/usuarios.service"
import { usuarioFake } from "../helpers/fixtures"

jest.mock("../../src/infrastructure/repositories/usuarios.repository", () => ({
  usuariosRepository: { existeEmail: jest.fn(), criar: jest.fn() },
}))
jest.mock("../../src/infrastructure/repositories/filtros.repository", () => ({ filtrosRepository: {} }))

const existeEmail = jest.mocked(usuariosRepository.existeEmail)
const criar = jest.mocked(usuariosRepository.criar)

const cadastro = { nome: "  Ana Beatriz Souza ", email: " Ana.Beatriz@Email.com ", senha: "Senha#12" }

describe("TC24 - Cadastro com e-mail já usado", () => {
  it("responde 409 e não cria a conta", async () => {
    existeEmail.mockResolvedValue(true)

    await expect(usuariosService.cadastrarComprador(cadastro)).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "Já existe uma conta com este e-mail.",
    })
    expect(criar).not.toHaveBeenCalled()
  })

  it("confere o e-mail em minúsculas, então a mesma conta com letras maiúsculas também é recusada", async () => {
    existeEmail.mockResolvedValue(true)

    await expect(usuariosService.cadastrarComprador(cadastro)).rejects.toMatchObject({ status: 409 })
    expect(existeEmail).toHaveBeenCalledWith("ana.beatriz@email.com")
  })
})

describe("TC23 - Cadastro de comprador com dados válidos", () => {
  beforeEach(() => {
    existeEmail.mockResolvedValue(false)
    criar.mockResolvedValue(usuarioFake())
  })

  it("salva o e-mail em minúsculas e o nome sem espaços nas pontas", async () => {
    await usuariosService.cadastrarComprador(cadastro)

    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ nome: "Ana Beatriz Souza", email: "ana.beatriz@email.com" }))
  })

  it("sempre cria a conta com o perfil comprador", async () => {
    await usuariosService.cadastrarComprador(cadastro)

    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ perfil: "comprador" }))
  })

  it("guarda a senha como hash, nunca o texto digitado", async () => {
    await usuariosService.cadastrarComprador(cadastro)

    const { senhaHash } = criar.mock.calls[0][0]
    expect(senhaHash).not.toBe(cadastro.senha)
    expect(await bcrypt.compare(cadastro.senha, senhaHash)).toBe(true)
  })

  it("devolve o usuário criado pelo repository", async () => {
    await expect(usuariosService.cadastrarComprador(cadastro)).resolves.toEqual(usuarioFake())
  })
})
