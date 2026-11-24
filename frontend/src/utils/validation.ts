// Mesmas regras de backend/src/shared/validacao.ts: ao mudar uma aqui, confira lá também.

export const SENHA_TAMANHO_MINIMO = 8

// Caractere especial: qualquer coisa que não seja letra, número ou espaço (ex.: @, #, $, !, &).
const CARACTERE_ESPECIAL = /[^\p{L}\p{N}\s]/u

/** Mensagem do problema da senha, ou undefined se ela atende às regras. */
export function problemaDaSenha(senha: string, rotulo = "A senha"): string | undefined {
  if (senha.length < SENHA_TAMANHO_MINIMO) return `${rotulo} precisa ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`
  if (!CARACTERE_ESPECIAL.test(senha)) return `${rotulo} precisa ter pelo menos um caractere especial (ex.: @, #, $, !, &).`
  return undefined
}

// Maior quantidade em estoque que uma peça pode ter.
export const ESTOQUE_MAXIMO = 999

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
