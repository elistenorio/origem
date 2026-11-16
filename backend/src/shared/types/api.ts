// Formatos compartilhados por todas as respostas (os mesmos de frontend/src/types/api.ts).

export type Paginated<T> = {
  items: T[]
  page: number // começa em 1
  pageSize: number
  total: number // total de itens que batem com o filtro
}
