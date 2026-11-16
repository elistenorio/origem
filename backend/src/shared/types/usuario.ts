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

export type MinhaConta = Usuario & {
  cpf: string // mascarado, ex.: "***.456.789-**"
  telefone: string
  endereco: Endereco
  formasPagamento: FormaPagamentoSalva[]
}
