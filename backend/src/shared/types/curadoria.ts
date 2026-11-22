import type { DecisaoCuradoria, TipoCuradoria } from "@prisma/client"

export type ItemCuradoria = {
  id: string
  tipo: TipoCuradoria
  titulo: string
  subtitulo: string
  enviadoEm: Date
  imagemUrl: string
  fotos: string[]
  descricao: string
  trajetoria?: string
  documentos: { nome: string; tamanho: string }[]
  historico: { titulo: string; data: Date }[]
}

export type DecidirCuradoriaInput = {
  decisao: DecisaoCuradoria
  parecer: string
}
