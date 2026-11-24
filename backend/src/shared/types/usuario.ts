// Contrato de "Minha conta": o mesmo formato de frontend/src/types/usuario.ts.
import type { PerfilUsuario, StatusUsuario } from "@prisma/client"
import type { Endereco } from "./pedido"

export type Usuario = {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  status: StatusUsuario
  cidade: string
  criadoEm: Date
}

export type FormaPagamentoSalva = { titulo: string; detalhe: string }

export type Preferencias = { newsletter: boolean; novidadesArtesaos: boolean; whatsapp: boolean }

export const PREFERENCIAS_PADRAO: Preferencias = { newsletter: true, novidadesArtesaos: true, whatsapp: false }

export type MinhaConta = Usuario & {
  cpf: string // mascarado, ex.: "***.456.789-**"
  telefone: string
  endereco: Endereco
  formasPagamento: FormaPagamentoSalva[]
  preferencias: Preferencias
}

export type DadosPessoaisInput = { nome: string; telefone: string; cpf?: string }

export const BANDEIRAS_CARTAO = ["Visa", "Mastercard", "Elo", "American Express", "Hipercard"] as const

export type CartaoInput = { bandeira: (typeof BANDEIRAS_CARTAO)[number]; ultimosDigitos: string }
