import { api } from "./api"
import type { ResumoPainelArtesao } from "@/types/artesao"
import type { Pedido } from "@/types/pedido"
import type { AtualizarEstoqueInput, Produto } from "@/types/produto"
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

  /** GET /minha-conta/produtos: todas as peças do artesão, em qualquer status ("Meu catálogo" e "Estoque"). */
  async produtos() {
    const response = await api.get<Produto[]>("/minha-conta/produtos")
    return response.data
  },

  /** GET /minha-conta/resumo: números do topo de "Meu catálogo" e "Estoque". */
  async resumo() {
    const response = await api.get<ResumoPainelArtesao>("/minha-conta/resumo")
    return response.data
  },

  /** PATCH /minha-conta/produtos/{id}: muda o estoque e/ou esconde e mostra a peça na vitrine. */
  async atualizarProduto(id: string, input: AtualizarEstoqueInput) {
    const response = await api.patch<Produto>(`/minha-conta/produtos/${id}`, input)
    return response.data
  },
}
