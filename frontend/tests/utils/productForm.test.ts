import { produtoParaFormulario, validarFormularioProduto } from "@/utils/productForm"
import { produtoInputFake, vasoDeBarroBiscoito } from "../helpers/fixtures"

describe("TC48 - Publicação de peça sem técnica e com preço inválido (HU-027, Cenários 2 e 3) - validação do formulário na tela", () => {
  it("passo 1: sem a técnica, a peça não é enviada e aparece \"Escolha a técnica.\"", () => {
    expect(validarFormularioProduto(produtoInputFake({ tecnica: "" }))).toEqual({ tecnica: "Escolha a técnica." })
  })

  it("passo 2: com o preço 0,00, a peça não é enviada e aparece \"Informe um preço maior que zero.\"", () => {
    expect(validarFormularioProduto(produtoInputFake({ preco: 0 }))).toEqual({ preco: "Informe um preço maior que zero." })
  })

  it("passo 3: com o preço 0,01, a peça pode ser enviada para análise", () => {
    expect(validarFormularioProduto(produtoInputFake({ preco: 0.01 }))).toEqual({})
  })
})

describe("validarFormularioProduto - outras regras", () => {
  it("nome, categoria e material são obrigatórios", () => {
    const erros = validarFormularioProduto(produtoInputFake({ titulo: " ", categoria: "", material: "" }))

    expect(erros).toEqual({
      titulo: "Informe o nome da peça.",
      categoria: "Escolha a categoria.",
      material: "Escolha o material principal.",
    })
  })

  it("medidas e peso aceitam só números, com vírgula ou ponto", () => {
    expect(validarFormularioProduto(produtoInputFake({ altura: "1,5", largura: "20.5", peso: "" }))).toEqual({})
    expect(validarFormularioProduto(produtoInputFake({ altura: "30cm" }))).toEqual({ altura: "Use só números (ex.: 15 ou 1,5)." })
  })

  it("peça com várias unidades enviada para análise precisa de estoque maior que zero", () => {
    expect(validarFormularioProduto(produtoInputFake({ pecaUnica: false, estoque: 0 }))).toEqual({
      estoque: "Informe a quantidade disponível.",
    })
  })

  it("rascunho pode ficar sem descrição, sem preço e sem estoque", () => {
    const rascunho = produtoInputFake({ enviarParaAnalise: false, descricao: "", preco: 0, pecaUnica: false, estoque: 0 })

    expect(validarFormularioProduto(rascunho)).toEqual({})
  })
})

describe("produtoParaFormulario", () => {
  it("separa as medidas salvas (largura × altura × profundidade) para os campos de edição", () => {
    const formulario = produtoParaFormulario(vasoDeBarroBiscoito)

    expect(formulario).toMatchObject({ largura: "20", altura: "30", profundidade: "20", estoque: 4, preco: 120.46 })
  })
})
