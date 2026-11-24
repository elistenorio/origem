import type { Endereco } from "./pedido"

export type PerfilUsuario = "comprador" | "artesao" | "admin"

export type StatusUsuario = "ativo" | "suspenso"

export type Usuario = {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  status: StatusUsuario
  cidade: string
  criadoEm: string
}

export type Preferencias = { newsletter: boolean; novidadesArtesaos: boolean; whatsapp: boolean }

// "Minha conta" (GET /minha-conta): o usuário logado com os dados que só ele vê.
export type MinhaConta = Usuario & {
  cpf: string           // mascarado, ex.: "***.456.789-**"
  telefone: string
  endereco: Endereco
  formasPagamento: { titulo: string; detalhe: string }[]
  preferencias: Preferencias
}

export type DadosPessoaisInput = { nome: string; telefone: string; cpf?: string }

export type CartaoInput = { bandeira: string; ultimosDigitos: string }

// O que o front ENVIA em POST /usuarios (cadastro do comprador).
// Na Avaliação 1 o cadastro é simulado; autenticação real vem na Avaliação 2.
export type CadastroCompradorInput = {
  nome: string
  email: string
  senha: string
}
