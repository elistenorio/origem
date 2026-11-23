import bcrypt from "bcryptjs"
import { usuariosRepository } from "../../src/infrastructure/repositories/usuarios.repository"
import { authService } from "../../src/infrastructure/services/auth.service"
import { AppError } from "../../src/shared/AppError"
import { verificarToken } from "../../src/shared/jwt"
import { usuarioFake } from "../helpers/fixtures"

jest.mock("../../src/infrastructure/repositories/usuarios.repository", () => ({
  usuariosRepository: { buscarPorEmailComSenha: jest.fn(), buscarPorId: jest.fn() },
}))
jest.mock("../../src/infrastructure/repositories/filtros.repository", () => ({ filtrosRepository: {} }))

const buscarPorEmailComSenha = jest.mocked(usuariosRepository.buscarPorEmailComSenha)
const SENHA = "Origem@123"
const senhaHash = bcrypt.hashSync(SENHA, 4)

describe("TC07 - Login com e-mail ou senha incorretos", () => {
  it("e-mail sem conta responde 401 com a mensagem genérica", async () => {
    buscarPorEmailComSenha.mockResolvedValue(null)

    const login = authService.login("ninguem@email.com", SENHA)

    await expect(login).rejects.toBeInstanceOf(AppError)
    await expect(login).rejects.toMatchObject({ status: 401, code: "UNAUTHORIZED", message: "E-mail ou senha incorretos." })
  })

  it("senha errada responde o mesmo 401, sem revelar que o e-mail existe", async () => {
    buscarPorEmailComSenha.mockResolvedValue({ ...usuarioFake(), senhaHash })

    await expect(authService.login("ana.beatriz@email.com", "SenhaErrada#1")).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
      message: "E-mail ou senha incorretos.",
    })
  })

  it("procura o e-mail sem espaços e em minúsculas", async () => {
    buscarPorEmailComSenha.mockResolvedValue(null)

    await expect(authService.login("  Ana.Beatriz@Email.com ", SENHA)).rejects.toMatchObject({ status: 401 })
    expect(buscarPorEmailComSenha).toHaveBeenCalledWith("ana.beatriz@email.com")
  })

  it("conta suspensa com a senha certa responde 403", async () => {
    buscarPorEmailComSenha.mockResolvedValue({ ...usuarioFake({ status: "suspenso" }), senhaHash })

    await expect(authService.login("ana.beatriz@email.com", SENHA)).rejects.toMatchObject({ status: 403, code: "FORBIDDEN" })
  })

  it("login certo devolve o token com id e perfil, e o usuário sem senhaHash", async () => {
    buscarPorEmailComSenha.mockResolvedValue({ ...usuarioFake(), senhaHash })

    const { token, usuario } = await authService.login("ana.beatriz@email.com", SENHA)

    expect(verificarToken(token)).toEqual({ id: "u1", perfil: "comprador" })
    expect(usuario).toEqual(usuarioFake())
    expect(usuario).not.toHaveProperty("senhaHash")
  })
})
