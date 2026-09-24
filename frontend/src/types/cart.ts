// Carrinho vive no cliente na Avaliação 1 (context + localStorage).
// Guarda só o essencial; preço e título vêm de Product para não ficarem desatualizados.
export type CartItem = {
  product: Product
  quantity: number
}

import type { Product } from "./product"
