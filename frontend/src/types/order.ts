export type OrderStatus = "pending" | "confirmed" | "cancelled"

// O que o front ENVIA em POST /orders
export type CreateOrderInput = {
  items: { productId: string; quantity: number }[]
  buyer: { name: string; email: string }
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
}

// O que a API DEVOLVE
export type Order = {
  id: string
  status: OrderStatus
  createdAt: string        // ISO 8601
  items: {
    productId: string
    title: string          // "foto" do momento da compra
    unitPrice: number      // idem: preço não muda depois do pedido
    quantity: number
  }[]
  total: number
  buyer: CreateOrderInput["buyer"]
  shippingAddress: CreateOrderInput["shippingAddress"]
}
