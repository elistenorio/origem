import type { NextFunction, Request, Response } from "express"
import { AppError } from "../shared/AppError"

type ApiErrorBody = { error: { code: string; message: string } }

// Rota que não existe: 404 no mesmo formato de erro da API.
export function notFoundHandler(_req: Request, res: Response<ApiErrorBody>) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Rota não encontrada." } })
}

// Middleware global de erros (o Express reconhece pelos 4 parâmetros).
// Todo next(err) dos controllers e middlewares cai aqui.
export function errorHandler(err: unknown, _req: Request, res: Response<ApiErrorBody>, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } })
  }

  // JSON mal formado no corpo da requisição (erro lançado pelo express.json()).
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: { code: "VALIDATION", message: "Corpo da requisição inválido." } })
  }

  // Erro inesperado: registra no log e não expõe detalhes ao cliente.
  console.error(err)
  return res.status(500).json({ error: { code: "INTERNAL", message: "Erro interno do servidor." } })
}
