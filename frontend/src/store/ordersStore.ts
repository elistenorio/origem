import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Pedido } from "@/types/pedido"

// Pedidos finalizados neste navegador (resposta de POST /pedidos).
// Por quê: na Fake API o pedido fica só na memória do servidor, e no deploy (Vercel) a próxima
// requisição pode cair em outra instância. Guardando aqui, "Meus pedidos" sempre mostra o pedido
// que acabou de ser feito. Na Avaliação 2 o backend salva de verdade e este store sai.
type OrdersStore = {
  orders: Pedido[]
  addOrder: (pedido: Pedido) => void
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (pedido) => set((state) => ({ orders: [pedido, ...state.orders] })),
    }),
    { name: "origem-pedidos" },
  ),
)
