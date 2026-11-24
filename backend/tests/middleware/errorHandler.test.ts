import { errorHandler, notFoundHandler } from "../../src/middleware/errorHandler"
import { AppError } from "../../src/shared/AppError"
import { fakeNext, fakeReq, fakeRes } from "../helpers/http"

describe("errorHandler - formato dos erros da API", () => {
  it("AppError sai com o status e no formato { error: { code, message } }", () => {
    const res = fakeRes()
    errorHandler(new AppError(409, "OUT_OF_STOCK", "Estoque insuficiente."), fakeReq(), res, fakeNext())

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ error: { code: "OUT_OF_STOCK", message: "Estoque insuficiente." } })
  })

  it("JSON mal formado no corpo vira 400 VALIDATION", () => {
    const res = fakeRes()
    const erro = Object.assign(new SyntaxError("Unexpected token"), { body: "{ruim" })
    errorHandler(erro, fakeReq(), res, fakeNext())

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: { code: "VALIDATION", message: "Corpo da requisição inválido." } })
  })

  it("erro desconhecido vira 500 sem expor detalhes", () => {
    const res = fakeRes()
    const log = jest.spyOn(console, "error").mockImplementation(() => undefined)
    errorHandler(new Error("senha do banco: 123"), fakeReq(), res, fakeNext())

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: { code: "INTERNAL", message: "Erro interno do servidor." } })
    log.mockRestore()
  })

  it("rota que não existe responde 404 no mesmo formato", () => {
    const res = fakeRes()
    notFoundHandler(fakeReq(), res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: { code: "NOT_FOUND", message: "Rota não encontrada." } })
  })
})
