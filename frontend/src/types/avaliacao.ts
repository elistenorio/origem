export type NotasAvaliacao = {
  produto?: number
  embalagem?: number
  entrega?: number
}

// O que o front ENVIA em POST /avaliacoes
export type CriarAvaliacaoInput = {
  pedidoId: string
  nota: number          // 1 a 5
  comentario: string
  notas: NotasAvaliacao
}

// O que a API DEVOLVE
export type Avaliacao = CriarAvaliacaoInput & {
  id: string
  criadoEm: string
}
