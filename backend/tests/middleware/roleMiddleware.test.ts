import { roleMiddleware } from "../../src/middleware/roleMiddleware"
import { adminLogado, artesaoLogado, compradorLogado } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

describe("roleMiddleware - acesso por perfil", () => {
  const soAdmin = roleMiddleware(["admin"])

  it("sem req.user responde 401", () => {
    const next = fakeNext()
    soAdmin(fakeReq(), fakeRes(), next)

    esperarAppError(next, 401, "UNAUTHORIZED")
  })

  it.each([compradorLogado, artesaoLogado])("perfil $perfil numa rota só de admin responde 403", (user) => {
    const next = fakeNext()
    soAdmin(fakeReq({ user }), fakeRes(), next)

    esperarAppError(next, 403, "FORBIDDEN", "Você não tem permissão para acessar este recurso.")
  })

  it("admin passa", () => {
    const next = fakeNext()
    soAdmin(fakeReq({ user: adminLogado }), fakeRes(), next)

    expect(next).toHaveBeenCalledWith()
  })

  it("rota com mais de um perfil aceita qualquer um deles", () => {
    const next = fakeNext()
    roleMiddleware(["artesao", "admin"])(fakeReq({ user: artesaoLogado }), fakeRes(), next)

    expect(next).toHaveBeenCalledWith()
  })
})
