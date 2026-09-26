import type { ApiErrorBody } from "@/types/api"

// Atraso artificial: faz o "carregando" das telas aparecer, como numa API real (o setTimeout da aula 06).
const LATENCY_MS = 300

const wait = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

// Resposta de sucesso.
export async function ok<T>(data: T, status = 200) {
  await wait()
  return Response.json(data, { status })
}

// Resposta de erro no formato { error: { code, message } } (o services/api.ts transforma em ApiError).
export async function fail(status: number, code: string, message: string) {
  await wait()
  const body: ApiErrorBody = { error: { code, message } }
  return Response.json(body, { status })
}
