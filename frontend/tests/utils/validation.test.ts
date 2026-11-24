import { ESTOQUE_MAXIMO, SENHA_TAMANHO_MINIMO, emailValido, problemaDaSenha } from "@/utils/validation"

// Mesmos casos que a Elis escreveu com node:test, no formato do Jest (npm test).
describe("utils/validation: regras de e-mail e senha iguais às do backend", () => {
  it("a senha precisa ter pelo menos 8 caracteres", () => {
    expect(SENHA_TAMANHO_MINIMO).toBe(8)
  })

  it("aceita e-mail com @", () => {
    expect(emailValido("nome@dominio.com")).toBe(true)
  })

  it("recusa e-mail sem @", () => {
    expect(emailValido("nomedominio.com")).toBe(false)
    expect(emailValido("")).toBe(false)
  })

  it('recusa "a@b", porque o domínio precisa ter ponto (como no backend)', () => {
    expect(emailValido("a@b")).toBe(false)
    expect(emailValido("a@b.")).toBe(false)
  })

  it("recusa e-mail com espaço no meio", () => {
    expect(emailValido("a b@c.com")).toBe(false)
  })

  it("ignora espaços nas pontas (como no backend)", () => {
    expect(emailValido(" nome@dominio.com ")).toBe(true)
  })
})

describe("utils/validation: senha forte e estoque máximo (mesmas regras do backend, TC25 e TC09)", () => {
  it("aceita senha com 8 caracteres e um caractere especial", () => {
    expect(problemaDaSenha("Senha#12")).toBeUndefined()
  })

  it("recusa senha curta", () => {
    expect(problemaDaSenha("Ab#1")).toBe("A senha precisa ter pelo menos 8 caracteres.")
  })

  it("recusa senha sem caractere especial", () => {
    expect(problemaDaSenha("SenhaForte2026")).toBe("A senha precisa ter pelo menos um caractere especial (ex.: @, #, $, !, &).")
  })

  it("usa o rótulo informado na mensagem (troca de senha)", () => {
    expect(problemaDaSenha("curta", "A nova senha")).toBe("A nova senha precisa ter pelo menos 8 caracteres.")
  })

  it("o estoque máximo é 999", () => {
    expect(ESTOQUE_MAXIMO).toBe(999)
  })
})
