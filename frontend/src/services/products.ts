import { http } from "./http"
import type { Paginated } from "@/types/api"
import type { FilterOptions, Product, ProductDetail, ProductFilters } from "@/types/product"

export const productsService = {
  list: (filters: ProductFilters = {}) =>
    http<Paginated<Product>>("/products", { query: { ...filters } }),

  get: (id: string) => http<ProductDetail>(`/products/${id}`),

  filterOptions: () => http<FilterOptions>("/filters"),
}
