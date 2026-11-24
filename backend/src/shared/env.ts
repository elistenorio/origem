import dotenv from "dotenv"

dotenv.config()

// Variável obrigatória: sem ela o servidor nem sobe (melhor falhar logo do que rodar com configuração errada).
function obrigatoria(nome: string): string {
  const valor = process.env[nome]
  if (!valor) throw new Error(`Variável de ambiente ${nome} não definida. Veja o .env.example.`)
  return valor
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3001),
  DATABASE_URL: obrigatoria("DATABASE_URL"),
  JWT_SECRET: obrigatoria("JWT_SECRET"),
  FRONTEND_URL: obrigatoria("FRONTEND_URL"),
  // Opcional: sem ela (ou com o Redis fora do ar) a API funciona normalmente, só sem cache.
  REDIS_URL: process.env.REDIS_URL || undefined,
}

export const isProduction = env.NODE_ENV === "production"
