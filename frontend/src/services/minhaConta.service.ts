import { api } from "./api"
import type { Pedido } from "@/types/pedido"
import type { MinhaConta } from "@/types/usuario"

// Dados do usuário logado. Na Avaliação 1 a Fake API usa uma compradora de demonstração;
// na Avaliação 2 o backend identifica o usuário pelo login, e estas chamadas continuam iguais.
export const minhaContaService = {
  /** GET /minha-conta: dados pessoais, endereço e formas de pagamento. */
  async buscar() {
    const response = await api.get<MinhaConta>("/minha-conta")
    return response.data
  },

  /** GET /minha-conta/pedidos: "Meus pedidos". */
  async pedidos() {
    const response = await api.get<Pedido[]>("/minha-conta/pedidos")
    return response.data
  },
}
