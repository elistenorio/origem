import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ItemCarrinho } from "@/types/carrinho"
import type { Produto } from "@/types/produto"

// Carrinho global (aula 05): qualquer tela lê e altera sem passar props.
// `persist` guarda no localStorage, então o carrinho sobrevive ao recarregar a página.
// Na Avaliação 2 as ações passam a sincronizar com o backend por um service.
type CartStore = {
  items: ItemCarrinho[]
  addItem: (produto: Produto, quantidade?: number) => void
  removeItem: (produtoId: string) => void
  updateQuantity: (produtoId: string, quantidade: number) => void
  clearCart: () => void
  totalItems: () => number   // valores derivados: calculados a partir dos itens, não guardados
  totalPrice: () => number
}

// A quantidade fica entre 1 e o estoque da peça.
const limitar = (quantidade: number, produto: Produto) => Math.min(Math.max(quantidade, 1), Math.max(produto.estoque, 1))

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (produto, quantidade = 1) =>
        set((state) => {
          const existente = state.items.find((item) => item.produto.id === produto.id)
          if (existente) {
            return {
              items: state.items.map((item) =>
                item.produto.id === produto.id ? { ...item, quantidade: limitar(item.quantidade + quantidade, produto) } : item,
              ),
            }
          }
          return { items: [...state.items, { produto, quantidade: limitar(quantidade, produto) }] }
        }),

      removeItem: (produtoId) => set((state) => ({ items: state.items.filter((item) => item.produto.id !== produtoId) })),

      updateQuantity: (produtoId, quantidade) => {
        if (quantidade <= 0) return get().removeItem(produtoId)
        set((state) => ({
          items: state.items.map((item) =>
            item.produto.id === produtoId ? { ...item, quantidade: limitar(quantidade, item.produto) } : item,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((soma, item) => soma + item.quantidade, 0),

      totalPrice: () => get().items.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0),
    }),
    { name: "origem-carrinho" },
  ),
)
