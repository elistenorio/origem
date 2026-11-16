// Mesmas regras de backend/src/shared/validacao.ts: ao mudar uma aqui, confira lá também.

export const SENHA_TAMANHO_MINIMO = 8

export function emailValido(email: string): boolean {
  return email.includes("@")
}
