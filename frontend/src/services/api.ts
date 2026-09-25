import axios from "axios"
import type { ApiErrorBody } from "@/types/api"

/** Erro que as telas recebem quando a API responde com erro (ex.: 404) ou está fora do ar. */
export class ApiError extends Error {
  code: string   // ex.: "NOT_FOUND", "VALIDATION"
  status: number // status HTTP; 0 quando nem foi possível conectar

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
}

/**
 * Instância do axios usada por todos os services (o services/api.ts da aula 05).
 * Avaliação 1: Fake API deste mesmo site ("/api").
 * Avaliação 2: basta definir NEXT_PUBLIC_API_URL com o endereço do backend; os services não mudam.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  timeout: 5000,
})

// Todo erro vira ApiError, com a mensagem que a API mandou em { error: { code, message } }.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError<ApiErrorBody>(error) && error.response) {
      const body = error.response.data?.error
      return Promise.reject(
        new ApiError(body?.code ?? "UNKNOWN", body?.message ?? "Erro inesperado.", error.response.status),
      )
    }
    // Sem resposta: a API está fora do ar ou não há conexão.
    return Promise.reject(new ApiError("NETWORK", "Não foi possível conectar ao servidor.", 0))
  },
)
