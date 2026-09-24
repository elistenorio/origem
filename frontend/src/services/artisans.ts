import { http } from "./http"
import type { Paginated } from "@/types/api"
import type { Artisan } from "@/types/artisan"
import type { Product } from "@/types/product"

export const artisansService = {
  get: (id: string) => http<Artisan>(`/artisans/${id}`),

  products: (id: string, page = 1, pageSize = 12) =>
    http<Paginated<Product>>(`/artisans/${id}/products`, { query: { page, pageSize } }),
}
