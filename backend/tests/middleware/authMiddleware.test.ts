import jwt from "jsonwebtoken"
import { usuariosRepository } from "../../src/infrastructure/repositories/usuarios.repository"
import { authMiddleware, optionalAuthMiddleware } from "../../src/middleware/authMiddleware"
import { gerarToken } from "../../src/shared/jwt"
import { compradorLogado, usuarioFake } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/repositories/usuarios.repository", () => ({ usuariosRepository: { buscarStatus: jest.fn() } }))

const buscarStatus = jest.mocked(usuariosRepository.buscarStatus)
const { nome, email, perfil } = usuarioFake()

describe("authMiddleware - proteção das rotas com login", () => {
  it("sem cookie responde 401 sem consultar o banco", async () => {
    const next = fakeNext()
    await authMiddleware(fakeReq(), fakeRes(), next)

    esperarAppError(next, 401, "UNAUTHORIZED", "Faça login para continuar.")
    expect(buscarStatus).not.toHaveBeenCalled()
  })

  it("token adulterado responde 401", async () => {
    const next = fakeNext()
    const token = jwt.sign(compradorLogado, "outro-segredo")
    await authMiddleware(fakeReq({ cookies: { token } }), fakeRes(), next)

    esperarAppError(next, 401, "UNAUTHORIZED", "Sessão inválida ou expirada. Faça login novamente.")
  })

  it("token expirado responde 401", async () => {
    const next = fakeNext()
    const token = jwt.sign(compradorLogado, process.env.JWT_SECRET as string, { expiresIn: -10 })
    await authMiddleware(fakeReq({ cookies: { token } }), fakeRes(), next)

    esperarAppError(next, 401, "UNAUTHORIZED")
  })

  it("token válido de conta que não existe mais responde 401", async () => {
    buscarStatus.mockResolvedValue(null)
    const next = fakeNext()
    await authMiddleware(fakeReq({ cookies: { token: gerarToken(compradorLogado) } }), fakeRes(), next)

    esperarAppError(next, 401, "UNAUTHORIZED", "Sessão inválida. Faça login novamente.")
  })

  it("token válido de conta suspensa responde 403", async () => {
    buscarStatus.mockResolvedValue({ nome, email, perfil, status: "suspenso" })
    const next = fakeNext()
    await authMiddleware(fakeReq({ cookies: { token: gerarToken(compradorLogado) } }), fakeRes(), next)

    esperarAppError(next, 403, "FORBIDDEN")
  })

  it("token válido de conta ativa preenche req.user com id e perfil", async () => {
    buscarStatus.mockResolvedValue({ nome, email, perfil, status: "ativo" })
    const req = fakeReq({ cookies: { token: gerarToken(compradorLogado) } })
    const next = fakeNext()
    await authMiddleware(req, fakeRes(), next)

    expect(next).toHaveBeenCalledWith()
    expect(req.user).toEqual(compradorLogado)
  })
})

describe("optionalAuthMiddleware - rotas abertas a visitantes", () => {
  it("sem cookie segue como visitante", () => {
    const req = fakeReq()
    const next = fakeNext()
    optionalAuthMiddleware(req, fakeRes(), next)

    expect(next).toHaveBeenCalledWith()
    expect(req.user).toBeUndefined()
  })

  it("token inválido segue como visitante, sem 401", () => {
    const req = fakeReq({ cookies: { token: "token-invalido" } })
    const next = fakeNext()
    optionalAuthMiddleware(req, fakeRes(), next)

    expect(next).toHaveBeenCalledWith()
    expect(req.user).toBeUndefined()
  })

  it("token válido preenche req.user", () => {
    const req = fakeReq({ cookies: { token: gerarToken(compradorLogado) } })
    optionalAuthMiddleware(req, fakeRes(), fakeNext())

    expect(req.user).toEqual(compradorLogado)
  })
})
