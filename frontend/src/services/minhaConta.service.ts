import { api } from "./api"
import type { PerfilArtesao, PerfilArtesaoInput, ResumoPainelArtesao } from "@/types/artesao"
import type { Pedido, VendaArtesao } from "@/types/pedido"
import type { AtualizarEstoqueInput, Produto, ProdutoInput } from "@/types/produto"
import type { MinhaConta } from "@/types/usuario"

// Dados do usuário logado: o backend identifica o usuário pelo login (cookie).
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

  async vendas() {
    const response = await api.get<VendaArtesao[]>("/minha-conta/vendas")
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

  /** POST /minha-conta/produtos: nova peça, como rascunho ou enviada para a curadoria. */
  async criarProduto(input: ProdutoInput) {
    const response = await api.post<Produto>("/minha-conta/produtos", input)
    return response.data
  },

  /** PUT /minha-conta/produtos/{id}: salva as mudanças da peça (volta para a curadoria ou para rascunho). */
  async editarProduto(id: string, input: ProdutoInput) {
    const response = await api.put<Produto>(`/minha-conta/produtos/${id}`, input)
    return response.data
  },

  /** DELETE /minha-conta/produtos/{id}: apaga a peça (só se ela nunca foi vendida). */
  async excluirProduto(id: string) {
    await api.delete(`/minha-conta/produtos/${id}`)
  },

  /** GET /minha-conta/perfil: perfil do artesão logado ("Meu perfil"). */
  async perfil() {
    const response = await api.get<PerfilArtesao>("/minha-conta/perfil")
    return response.data
  },

  /** PUT /minha-conta/perfil: salva o perfil do artesão logado. */
  async atualizarPerfil(input: PerfilArtesaoInput) {
    const response = await api.put<PerfilArtesao>("/minha-conta/perfil", input)
    return response.data
  },
}
