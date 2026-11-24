import { validateCheckout } from "@/utils/validateCheckout"
import { dadosCheckoutFake } from "../helpers/fixtures"

describe("TC40 - Conclusão de pedido sem endereço, sem forma de pagamento ou com carrinho vazio (HU-018, Cenários 2, 3 e 4) - validação do checkout na tela", () => {
  it("passo 1: sem o endereço de entrega, o pedido não é enviado e cada campo do endereço mostra uma mensagem", () => {
    const erros = validateCheckout(dadosCheckoutFake({ cep: "", rua: "", numero: "", bairro: "", cidade: "", estado: "" }))

    expect(erros).toEqual({
      cep: "Informe o CEP.",
      rua: "Informe a rua.",
      numero: "Informe o número.",
      bairro: "Informe o bairro.",
      cidade: "Informe a cidade.",
      estado: "Escolha o estado.",
    })
  })

  it("passo 1: campos do endereço preenchidos só com espaços contam como vazios", () => {
    const erros = validateCheckout(dadosCheckoutFake({ rua: "   ", numero: " " }))

    expect(erros).toEqual({ rua: "Informe a rua.", numero: "Informe o número." })
  })
})

describe("validateCheckout - outras regras", () => {
  it("com todos os dados preenchidos e pagamento por Pix não há erros", () => {
    expect(validateCheckout(dadosCheckoutFake())).toEqual({})
  })

  it("e-mail sem @ é recusado", () => {
    expect(validateCheckout(dadosCheckoutFake({ email: "ana.beatriz.email.com" }))).toEqual({ email: "Informe um e-mail válido." })
  })

  it("CPF sem os 11 números é recusado", () => {
    expect(validateCheckout(dadosCheckoutFake({ cpf: "123.456.789-0" }))).toEqual({ cpf: "O CPF precisa ter 11 números." })
  })

  it("no cartão, número curto, nome vazio, validade fora de MM/AA e CVV inválido são recusados", () => {
    const erros = validateCheckout(
      dadosCheckoutFake({ pagamento: "cartao", numeroCartao: "4111 1111", nomeCartao: "", validade: "1/27", cvv: "12" }),
    )

    expect(erros).toEqual({
      numeroCartao: "Número do cartão inválido.",
      nomeCartao: "Informe o nome impresso no cartão.",
      validade: "Use o formato MM/AA.",
      cvv: "CVV inválido.",
    })
  })

  it("com os dados do cartão corretos não há erros", () => {
    const dados = dadosCheckoutFake({
      pagamento: "cartao",
      numeroCartao: "4111 1111 1111 1111",
      nomeCartao: "ANA B SOUZA",
      validade: "08/29",
      cvv: "123",
    })

    expect(validateCheckout(dados)).toEqual({})
  })

  it("com Pix, os campos do cartão vazios não geram erro", () => {
    expect(validateCheckout(dadosCheckoutFake({ pagamento: "pix", numeroCartao: "", cvv: "" }))).toEqual({})
  })
})
