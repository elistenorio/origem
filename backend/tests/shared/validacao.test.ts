import { emailValido, escaparLike, numeroDaQuery, textoDaQuery } from "../../src/shared/validacao"

describe("emailValido", () => {
  it.each(["ana@email.com", "  ana.beatriz@origem.com.br  "])("aceita %s", (email) => {
    expect(emailValido(email)).toBe(true)
  })

  it.each(["", "ana", "ana@email", "ana @email.com", "@email.com", 123, null])("recusa %p", (email) => {
    expect(emailValido(email)).toBe(false)
  })
})

describe("escaparLike", () => {
  it("escapa % e _ para a busca ser literal", () => {
    expect(escaparLike("50%_off")).toBe("50\\%\\_off")
  })

  it("escapa a própria barra invertida", () => {
    expect(escaparLike("a\\b")).toBe("a\\\\b")
  })

  it("texto comum não muda", () => {
    expect(escaparLike("cerâmica")).toBe("cerâmica")
  })
})

describe("valores da query string", () => {
  it("textoDaQuery tira os espaços e transforma vazio ou repetido em undefined", () => {
    expect(textoDaQuery("  barro ")).toBe("barro")
    expect(textoDaQuery("   ")).toBeUndefined()
    expect(textoDaQuery(["a", "b"])).toBeUndefined()
  })

  it("numeroDaQuery converte número e ignora valor inválido", () => {
    expect(numeroDaQuery("120.5")).toBe(120.5)
    expect(numeroDaQuery("abc")).toBeUndefined()
    expect(numeroDaQuery(undefined)).toBeUndefined()
  })
})
