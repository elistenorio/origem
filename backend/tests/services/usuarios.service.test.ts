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

const cadastro = { nome: "  Joana Ferreira ", email: " Joana.Ferreira@Exemplo.com ", senha: "Senha#2026" }

describe("TC23 - Criação de conta com dados válidos (HU-001, Cenário 1)", () => {
  beforeEach(() => {
    existeEmail.mockResolvedValue(false)
    criar.mockResolvedValue(usuarioFake())
  })

  it("cria a conta com o perfil comprador", async () => {
    await usuariosService.cadastrarComprador(cadastro)

    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ perfil: "comprador" }))
  })

  it("salva o e-mail em minúsculas e o nome sem espaços nas pontas", async () => {
    await usuariosService.cadastrarComprador(cadastro)

    expect(criar).toHaveBeenCalledWith(expect.objectContaining({ nome: "Joana Ferreira", email: "joana.ferreira@exemplo.com" }))
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

describe("TC24 - Criação de conta com e-mail já cadastrado (HU-001, Cenário 2)", () => {
  it("responde 409 \"Já existe uma conta com este e-mail.\" e não cria a conta", async () => {
    existeEmail.mockResolvedValue(true)

    await expect(usuariosService.cadastrarComprador({ ...cadastro, email: "ana.beatriz@email.com" })).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "Já existe uma conta com este e-mail.",
    })
    expect(criar).not.toHaveBeenCalled()
  })

  it("confere o e-mail em minúsculas, então o mesmo e-mail com letras maiúsculas também é recusado", async () => {
    existeEmail.mockResolvedValue(true)

    await expect(usuariosService.cadastrarComprador({ ...cadastro, email: "Ana.Beatriz@Email.com" })).rejects.toMatchObject({ status: 409 })
    expect(existeEmail).toHaveBeenCalledWith("ana.beatriz@email.com")
  })
})
