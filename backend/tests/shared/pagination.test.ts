import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, paginated, readPagination } from "../../src/shared/pagination"

describe("readPagination", () => {
  it("sem page e pageSize usa a página 1 e o tamanho padrão", () => {
    expect(readPagination({})).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE, skip: 0, take: DEFAULT_PAGE_SIZE })
  })

  it("calcula quantos itens pular", () => {
    expect(readPagination({ page: "3", pageSize: "10" })).toEqual({ page: 3, pageSize: 10, skip: 20, take: 10 })
  })

  it(`limita o pageSize a ${MAX_PAGE_SIZE}`, () => {
    expect(readPagination({ pageSize: "5000" }).pageSize).toBe(MAX_PAGE_SIZE)
  })

  it.each([["0"], ["-2"], ["abc"]])("page inválida (%s) vira 1", (page) => {
    expect(readPagination({ page }).page).toBe(1)
  })
})

describe("paginated", () => {
  it("monta a resposta no formato Paginated", () => {
    expect(paginated(["a", "b"], 30, readPagination({ page: "2", pageSize: "2" }))).toEqual({ items: ["a", "b"], page: 2, pageSize: 2, total: 30 })
  })
})
