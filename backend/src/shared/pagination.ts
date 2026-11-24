import type { Paginated } from "./types/api"

export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100 // evita uma página gigante derrubar o banco

export type Pagination = {
  page: number
  pageSize: number
  skip: number // quantos itens pular no banco
  take: number // quantos itens buscar
}

// Lê page e pageSize da query string; valor ausente ou inválido vira o padrão.
export function readPagination(query: { page?: unknown; pageSize?: unknown }): Pagination {
  const page = Math.max(1, Math.floor(Number(query.page)) || 1)
  const pedido = Math.max(1, Math.floor(Number(query.pageSize)) || DEFAULT_PAGE_SIZE)
  const pageSize = Math.min(pedido, MAX_PAGE_SIZE)
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize }
}

export function paginated<T>(items: T[], total: number, pagination: Pagination): Paginated<T> {
  return { items, page: pagination.page, pageSize: pagination.pageSize, total }
}
