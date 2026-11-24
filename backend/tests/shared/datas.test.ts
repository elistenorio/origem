import { adicionarDiasUteis, inicioDoDia } from "../../src/shared/datas"

describe("adicionarDiasUteis", () => {
  it("de segunda, 3 dias úteis caem na quinta", () => {
    expect(adicionarDiasUteis(new Date("2026-11-23T15:00:00Z"), 3)).toEqual(new Date("2026-11-26T15:00:00Z"))
  })

  it("pula o fim de semana: de sexta, 1 dia útil cai na segunda", () => {
    expect(adicionarDiasUteis(new Date("2026-11-20T15:00:00Z"), 1)).toEqual(new Date("2026-11-23T15:00:00Z"))
  })

  it("usa o dia de Recife: sexta 22h em Recife (sábado 01h UTC) + 1 dia útil cai na segunda", () => {
    expect(adicionarDiasUteis(new Date("2026-11-21T01:00:00Z"), 1)).toEqual(new Date("2026-11-24T01:00:00Z"))
  })

  it("0 dias devolve a mesma data", () => {
    const data = new Date("2026-11-23T15:00:00Z")
    expect(adicionarDiasUteis(data, 0)).toEqual(data)
  })
})

describe("inicioDoDia", () => {
  it("às 22h de Recife (01h UTC do dia seguinte), o dia ainda é o de Recife", () => {
    expect(inicioDoDia(new Date("2026-11-24T01:00:00Z"))).toEqual(new Date("2026-11-23T03:00:00Z"))
  })
})
