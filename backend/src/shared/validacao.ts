// Validações simples usadas pelos controllers (o corpo da requisição chega como unknown).

export function textoPreenchido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0
}

export function emailValido(valor: unknown): valor is string {
  return typeof valor === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
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

// Mesma regra do formulário de cadastro do frontend (BuyerRegisterForm).
export const SENHA_TAMANHO_MINIMO = 8
