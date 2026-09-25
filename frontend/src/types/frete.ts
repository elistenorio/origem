// Opções de frete (GET /frete?cep=).
export type ModalidadeFrete = "pac" | "sedex"

export type OpcaoFrete = {
  modalidade: ModalidadeFrete
  nome: string          // ex.: "PAC"
  valor: number
  prazo: string         // ex.: "6 a 8 dias úteis"
}
