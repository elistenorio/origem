import { getOptionLabel } from "@/utils/getOptionLabel"

// Mesmo formato das listas de constants/ (ex.: CATEGORIAS, TECNICAS).
const opcoes = [
  { value: "modelagem-manual", label: "Modelagem manual" },
  { value: "ceramica-barro", label: "Cerâmica e Barro" },
]

describe("getOptionLabel", () => {
  it("devolve o texto da opção quando o valor existe na lista", () => {
    expect(getOptionLabel(opcoes, "modelagem-manual")).toBe("Modelagem manual")
    expect(getOptionLabel(opcoes, "ceramica-barro")).toBe("Cerâmica e Barro")
  })

  it("devolve o próprio valor quando ele não está na lista", () => {
    expect(getOptionLabel(opcoes, "valor-desconhecido")).toBe("valor-desconhecido")
  })

  it("devolve o próprio valor quando a lista está vazia", () => {
    expect(getOptionLabel([], "ceramica-barro")).toBe("ceramica-barro")
  })
})
