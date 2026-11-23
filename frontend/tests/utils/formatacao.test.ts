import { formatCurrency, formatCurrencyCompact, splitCurrency } from "@/utils/formatCurrency"
import { normalizeText } from "@/utils/normalizeText"

describe("normalizeText (busca sem acento e sem maiúscula)", () => {
  it("tira acentos, passa para minúsculas e remove espaços nas pontas", () => {
    expect(normalizeText("  Cerâmica de Tracunhaém ")).toBe("ceramica de tracunhaem")
  })
})

describe("formatCurrency", () => {
  it("formata em reais com vírgula nos centavos", () => {
    expect(formatCurrency(167.9)).toMatch(/^R\$\s167,90$/)
    expect(formatCurrency(1250.9)).toMatch(/^R\$\s1\.250,90$/)
  })

  it("separa a parte inteira dos centavos", () => {
    expect(splitCurrency(1250.9)).toEqual({ inteiro: "1.250", centavos: "90" })
  })

  it("valores a partir de 10 mil aparecem resumidos, os menores aparecem completos", () => {
    expect(formatCurrencyCompact(24380)).toMatch(/^R\$ 24,4\smil$/)
    expect(formatCurrencyCompact(9999.5)).toMatch(/^R\$\s9\.999,50$/)
  })
})
