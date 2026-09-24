// Formatos compartilhados por TODAS as respostas da API (fake agora, real na Avaliação 2).

export type Paginated<T> = {
  items: T[]
  page: number      // começa em 1
  pageSize: number
  total: number     // total de itens que batem com o filtro
}

// Corpo de qualquer resposta de erro (status 4xx/5xx).
export type ApiErrorBody = {
  error: {
    code: string    // ex.: "NOT_FOUND", "VALIDATION", "OUT_OF_STOCK"
    message: string // texto que pode ser mostrado ao usuário
  }
}
