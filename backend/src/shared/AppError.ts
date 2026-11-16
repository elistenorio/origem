// Erro "esperado" da aplicação (validação, não encontrado, sem permissão...).
// Os services lançam AppError e o errorHandler transforma em { error: { code, message } } com o status certo.
// Códigos usados (docs/api.md): VALIDATION 400, UNAUTHORIZED 401, FORBIDDEN 403, NOT_FOUND 404,
// CONFLICT 409, OUT_OF_STOCK 409, INTERNAL 500.
export class AppError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.code = code
  }
}
