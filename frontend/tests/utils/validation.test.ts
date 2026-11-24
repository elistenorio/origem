import { SENHA_TAMANHO_MINIMO, emailValido } from "@/utils/validation"

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
