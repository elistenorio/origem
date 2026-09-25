import type { Produto } from "./produto"

// Carrinho vive no cliente na Avaliação 1 (Zustand + localStorage, em store/cartStore.ts).
// Totais e contagem são calculados a partir dos itens, não guardados.
export type ItemCarrinho = {
  produto: Produto
  quantidade: number
}
