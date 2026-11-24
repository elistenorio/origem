import { useCartStore } from "@/store/cartStore"
import { conjBrasileiro, toalhaDeRenda, vasoDeBarroBiscoito } from "../helpers/fixtures"

// O store é usado fora do React: getState() lê o estado e chama as ações, como os componentes fazem.
const carrinho = () => useCartStore.getState()
const quantidadeDe = (produtoId: string) => carrinho().items.find((item) => item.produto.id === produtoId)?.quantidade

beforeEach(() => {
  localStorage.clear()
  useCartStore.setState({ items: [], frete: null })
})

describe("TC36 - Adição de peça ao carrinho e de peça que já está no carrinho (HU-016, Cenários 1 e 2) - nível componente (store do carrinho)", () => {
  it("passo 1: adicionar \"Conj. Brasileiro\" com quantidade 1 coloca a peça no carrinho", () => {
    carrinho().addItem(conjBrasileiro, 1)

    expect(carrinho().items).toHaveLength(1)
    expect(quantidadeDe("p3")).toBe(1)
  })

  it("passo 2: adicionar de novo a mesma peça soma a quantidade (2) sem duplicar a linha", () => {
    carrinho().addItem(conjBrasileiro, 1)
    carrinho().addItem(conjBrasileiro, 1)

    expect(carrinho().items).toHaveLength(1)
    expect(quantidadeDe("p3")).toBe(2)
    expect(carrinho().totalItems()).toBe(2)
  })
})

describe("TC37 - Quantidade acima do estoque ao adicionar e ao alterar (HU-016, Cenário 3, e HU-017, Cenário 3) - nível componente (store do carrinho)", () => {
  it("passo 1: as 3 unidades da \"Toalha de Renda\" (estoque 3) são adicionadas", () => {
    carrinho().addItem(toalhaDeRenda, 3)

    expect(quantidadeDe("p7")).toBe(3)
  })

  it("passo 2: adicionar mais 1 unidade (total 4) não passa do estoque e a quantidade continua 3", () => {
    carrinho().addItem(toalhaDeRenda, 3)
    carrinho().addItem(toalhaDeRenda, 1)

    expect(quantidadeDe("p7")).toBe(3)
  })

  it("passo 3: alterar a quantidade para 5 no carrinho não passa do estoque e a quantidade continua 3", () => {
    carrinho().addItem(toalhaDeRenda, 3)
    carrinho().updateQuantity("p7", 5)

    expect(quantidadeDe("p7")).toBe(3)
  })
})

describe("TC38 - Alteração de quantidade dentro do estoque e remoção de item do carrinho (HU-017, Cenários 1 e 2) - nível componente (store do carrinho)", () => {
  beforeEach(() => {
    carrinho().addItem(vasoDeBarroBiscoito, 1)
  })

  it("passo 1: alterar a quantidade do \"Vaso de Barro Biscoito\" (estoque 4) para 3 recalcula o total", () => {
    carrinho().updateQuantity("p9", 3)

    expect(quantidadeDe("p9")).toBe(3)
    expect(carrinho().totalItems()).toBe(3)
    expect(carrinho().totalPrice()).toBeCloseTo(361.38, 2)
  })

  it("passo 2: remover a peça tira ela do carrinho e zera os totais", () => {
    carrinho().removeItem("p9")

    expect(carrinho().items).toHaveLength(0)
    expect(carrinho().totalItems()).toBe(0)
    expect(carrinho().totalPrice()).toBe(0)
  })

  it("alterar a quantidade para 0 também remove a peça", () => {
    carrinho().updateQuantity("p9", 0)

    expect(carrinho().items).toHaveLength(0)
  })
})

describe("cartStore - outras regras", () => {
  it("o total soma preço × quantidade de todas as peças", () => {
    carrinho().addItem(conjBrasileiro, 2)
    carrinho().addItem(vasoDeBarroBiscoito, 1)

    expect(carrinho().totalItems()).toBe(3)
    expect(carrinho().totalPrice()).toBeCloseTo(167.9 * 2 + 120.46, 2)
  })

  it("quantidade menor que 1 ao adicionar vira 1", () => {
    carrinho().addItem(conjBrasileiro, 0)

    expect(quantidadeDe("p3")).toBe(1)
  })

  it("esvaziar o carrinho tira as peças e o frete escolhido", () => {
    carrinho().addItem(conjBrasileiro, 1)
    carrinho().setFrete({ modalidade: "pac", nome: "PAC", valor: 18.9, prazo: "6 a 8 dias úteis" })

    carrinho().clearCart()

    expect(carrinho().items).toHaveLength(0)
    expect(carrinho().frete).toBeNull()
  })

  it("o carrinho fica guardado no localStorage, para sobreviver ao recarregar a página", () => {
    carrinho().addItem(conjBrasileiro, 2)

    const salvo = JSON.parse(localStorage.getItem("origem-carrinho") ?? "{}")
    expect(salvo.state.items[0]).toMatchObject({ produto: { id: "p3" }, quantidade: 2 })
  })
})
