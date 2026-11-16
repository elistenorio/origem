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

// 401 de quem chega a uma rota protegida sem estar logado. Fica num lugar só para a mensagem ser igual em toda a API.
// É uma função, e não uma constante, para cada chamada criar um erro novo (com o stack trace de onde foi lançado).
export function naoAutenticado(): AppError {
  return new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")
}
