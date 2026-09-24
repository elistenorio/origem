import { http } from "./http"
import type { CreateOrderInput, Order } from "@/types/order"

export const ordersService = {
  create: (input: CreateOrderInput) =>
    http<Order>("/orders", { method: "POST", body: input }),

  get: (id: string) => http<Order>(`/orders/${id}`),
}
