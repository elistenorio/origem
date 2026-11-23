import { minhaContaController } from "../../src/application/controllers/minhaConta.controller"
import { minhaContaService } from "../../src/infrastructure/services/minhaConta.service"
import { artesaoLogado, produtoFake } from "../helpers/fixtures"
import { esperarAppError, fakeNext, fakeReq, fakeRes } from "../helpers/http"

jest.mock("../../src/infrastructure/services/minhaConta.service", () => ({
  minhaContaService: { atualizarProduto: jest.fn(), criarProduto: jest.fn() },
}))
jest.mock("../../src/infrastructure/services/painelArtesao.service", () => ({ painelArtesaoService: {} }))
jest.mock("../../src/infrastructure/services/pedidos.service", () => ({ pedidosService: {} }))

const atualizarProduto = jest.mocked(minhaContaService.atualizarProduto)
const criarProduto = jest.mocked(minhaContaService.criarProduto)

async function chamar(acao: "atualizarProduto" | "criarProduto", body: unknown) {
  const res = fakeRes()
  const next = fakeNext()
  await minhaContaController[acao](fakeReq({ params: { id: "p9" }, body, user: artesaoLogado }), res, next)
  return { res, next }
}

describe("TC09 - Quantidade em estoque fora da faixa permitida (HU-030, Cenários 3 e 4)", () => {
  beforeEach(() => atualizarProduto.mockResolvedValue(produtoFake({ id: "p9" })))

  it("passo 1: recusa -1 com 400 VALIDATION", async () => {
    const { next } = await chamar("atualizarProduto", { estoque: -1 })

    esperarAppError(next, 400, "VALIDATION", "O estoque precisa ser um número inteiro, zero ou maior.")
    expect(atualizarProduto).not.toHaveBeenCalled()
  })

  it("passo 2: recusa 1000 com 400 VALIDATION", async () => {
    const { next } = await chamar("atualizarProduto", { estoque: 1000 })

    esperarAppError(next, 400, "VALIDATION")
    expect(atualizarProduto).not.toHaveBeenCalled()
  })

  it.each([0, 1, 998, 999])("passos 3 e 4: aceita %i e chama o service", async (estoque) => {
    const { res, next } = await chamar("atualizarProduto", { estoque })

    expect(next).not.toHaveBeenCalled()
    expect(atualizarProduto).toHaveBeenCalledWith(artesaoLogado.id, "p9", { estoque, status: undefined })
    expect(res.status).toHaveBeenCalledWith(200)
  })
})

const pecaCompleta = {
  titulo: "Vaso de Barro Biscoito",
  categoria: "ceramica-barro",
  descricao: "Vaso modelado à mão em barro cru.",
  material: "barro",
  tecnica: "modelagem-manual",
  altura: "30",
  largura: "20",
  profundidade: "20",
  peso: "1,2",
  pecaUnica: false,
  estoque: 3,
  preco: 120.46,
  prazoPostagem: "3",
  embalagem: "caixa",
  cuidadosEnvio: "",
  enviarParaAnalise: true,
}

describe("TC48 - Publicação de peça sem técnica e com preço inválido (HU-027, Cenários 2 e 3)", () => {
  beforeEach(() => criarProduto.mockResolvedValue(produtoFake({ status: "emAnalise" })))

  it("passo 1: sem técnica responde 400 \"Escolha a técnica.\"", async () => {
    const { next } = await chamar("criarProduto", { ...pecaCompleta, tecnica: "" })

    esperarAppError(next, 400, "VALIDATION", "Escolha a técnica.")
    expect(criarProduto).not.toHaveBeenCalled()
  })

  it("passo 2: preço 0,00 enviando para análise responde 400 \"Informe um preço maior que zero.\"", async () => {
    const { next } = await chamar("criarProduto", { ...pecaCompleta, preco: 0 })

    esperarAppError(next, 400, "VALIDATION", "Informe um preço maior que zero.")
    expect(criarProduto).not.toHaveBeenCalled()
  })

  it("passo 3: preço 0,01 é aceito, a peça vai para análise e responde 201", async () => {
    const { res, next } = await chamar("criarProduto", { ...pecaCompleta, preco: 0.01 })

    expect(next).not.toHaveBeenCalled()
    expect(criarProduto).toHaveBeenCalledWith(
      artesaoLogado.id,
      expect.objectContaining({ tecnica: "modelagem-manual", preco: 0.01, enviarParaAnalise: true }),
    )
    expect(res.status).toHaveBeenCalledWith(201)
  })
})
