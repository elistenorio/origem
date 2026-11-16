import type { OpcaoFrete } from "../../shared/types/frete"

export const freteService = {
  /**
   * GET /frete?cep=: opções de PAC e SEDEX para o CEP (8 números, já validado pelo controller).
   * Simulação, igual à da Fake API: CEPs de Pernambuco (começam de 50 a 56) pagam menos.
   * Pode ser trocada depois por uma consulta aos Correios, mantendo o mesmo formato.
   */
  calcular(cep: string): OpcaoFrete[] {
    const prefixo = Number(cep.slice(0, 2))
    const local = prefixo >= 50 && prefixo <= 56

    return [
      { modalidade: "pac", nome: "PAC", valor: local ? 18.9 : 32.4, prazo: local ? "6 a 8 dias úteis" : "8 a 12 dias úteis" },
      { modalidade: "sedex", nome: "SEDEX", valor: local ? 27.5 : 49.9, prazo: local ? "2 a 4 dias úteis" : "4 a 6 dias úteis" },
    ]
  },
}
