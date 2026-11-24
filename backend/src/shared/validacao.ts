import { AppError } from "./AppError"

// Validações e normalizações simples da entrada, usadas pelos controllers e services
// (o corpo da requisição chega como unknown).

export function textoPreenchido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0
}

export function emailValido(valor: unknown): valor is string {
  return typeof valor === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
}

// E-mail é comparado sem diferenciar maiúsculas e sem espaços nas pontas.
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Objeto JSON comum (não array, não null).
export function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor)
}

// Texto do corpo da requisição; qualquer outra coisa vira "" (com espaços das pontas removidos).
export function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : ""
}

// Valor de texto da query string (?categoria=...). Ausente, vazio ou repetido (?a=1&a=2) vira undefined.
export function textoDaQuery(valor: unknown): string | undefined {
  if (typeof valor !== "string") return undefined
  const texto = valor.trim()
  return texto || undefined
}

// Número da query string; ausente ou inválido vira undefined.
export function numeroDaQuery(valor: unknown): number | undefined {
  const texto = textoDaQuery(valor)
  if (texto === undefined) return undefined
  const numero = Number(texto)
  return Number.isFinite(numero) ? numero : undefined
}

// Escapa % e _ para o texto ser procurado literalmente num LIKE do PostgreSQL.
export function escaparLike(texto: string): string {
  return texto.replace(/[\\%_]/g, (c) => `\\${c}`)
}

// Mesmas regras de frontend/src/utils/validation.ts (formulários de cadastro e troca de senha).
export const SENHA_TAMANHO_MINIMO = 8

// Caractere especial: qualquer coisa que não seja letra, número ou espaço (ex.: @, #, $, !, &).
const CARACTERE_ESPECIAL = /[^\p{L}\p{N}\s]/u

/**
 * Confere as regras da senha e lança 400 VALIDATION com a mensagem do problema.
 * Depois da chamada, o TypeScript sabe que `senha` é texto.
 * `rotulo` muda o começo da mensagem (ex.: "A nova senha" na troca de senha).
 */
export function validarSenha(senha: unknown, rotulo = "A senha"): asserts senha is string {
  if (typeof senha !== "string" || senha.length < SENHA_TAMANHO_MINIMO) {
    throw new AppError(400, "VALIDATION", `${rotulo} precisa ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`)
  }
  if (!CARACTERE_ESPECIAL.test(senha)) {
    throw new AppError(400, "VALIDATION", `${rotulo} precisa ter pelo menos um caractere especial (ex.: @, #, $, !, &).`)
  }
}

// Maior quantidade em estoque que uma peça pode ter (plano de testes, HU-030).
export const ESTOQUE_MAXIMO = 999
