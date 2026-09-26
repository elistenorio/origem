import type { Paginated } from "@/types/api"

// Lê page e pageSize da URL; valor ausente ou inválido vira o padrão.
export function readPagination(params: URLSearchParams, defaultPageSize = 12) {
  const page = Math.max(1, Number(params.get("page")) || 1)
  const pageSize = Math.max(1, Number(params.get("pageSize")) || defaultPageSize)
  return { page, pageSize }
}

// Devolve só a página pedida, com o total de itens que bateram com o filtro.
export function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length }
}
