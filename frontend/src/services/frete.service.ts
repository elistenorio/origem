import { api } from "./api"
import type { OpcaoFrete } from "@/types/frete"

export const freteService = {
  /** GET /frete?cep=: opções de frete para o CEP (erro VALIDATION se o CEP for inválido). */
  async calcular(cep: string) {
    const response = await api.get<OpcaoFrete[]>("/frete", { params: { cep } })
    return response.data
  },
}
