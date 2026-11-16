// Opção de frete (GET /frete?cep=): o mesmo formato de frontend/src/types/frete.ts.
export type ModalidadeFrete = "pac" | "sedex"

export type OpcaoFrete = {
  modalidade: ModalidadeFrete
  nome: string
  valor: number
  prazo: string
}
