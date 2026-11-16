// Validações simples usadas pelos controllers (o corpo da requisição chega como unknown).

export function textoPreenchido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0
}

export function emailValido(valor: unknown): valor is string {
  return typeof valor === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
}

// Mesma regra do formulário de cadastro do frontend (BuyerRegisterForm).
export const SENHA_TAMANHO_MINIMO = 8
