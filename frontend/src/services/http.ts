import type { ApiErrorBody } from "@/types/api"

// Fake API (A1): rotas em src/app/api/* -> base "/api".
// Backend real (A2): definir NEXT_PUBLIC_API_URL e NADA mais muda nos services.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api"

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type Query = Record<string, string | number | undefined>

type Options = Omit<RequestInit, "body"> & {
  query?: Query
  body?: unknown
}

export async function http<T>(path: string, options: Options = {}): Promise<T> {
  const { query, body, ...init } = options

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") params.set(key, String(value))
  }
  const qs = params.toString()
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`

  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError("NETWORK", "Não foi possível conectar ao servidor.", 0)
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(
      data?.error?.code ?? "UNKNOWN",
      data?.error?.message ?? "Erro inesperado.",
      res.status,
    )
  }

  return (await res.json()) as T
}
