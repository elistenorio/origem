import type { PerfilUsuario, Prisma } from "@prisma/client"
import { prisma } from "../prisma/client"

// Campos do usuário que podem sair na resposta da API (tipo Usuario do frontend). Nunca inclui senhaHash.
const selectUsuarioPublico = {
  id: true,
  nome: true,
  email: true,
  perfil: true,
  status: true,
  cidade: true,
  criadoEm: true,
} satisfies Prisma.UsuarioSelect

export type UsuarioPublico = Prisma.UsuarioGetPayload<{ select: typeof selectUsuarioPublico }>

type CriarUsuarioData = {
  nome: string
  email: string
  senhaHash: string
  perfil: PerfilUsuario
}

// Acesso ao banco da tabela Usuario. Sem regra de negócio: só consultas e gravações.
export const usuariosRepository = {
  // Inclui senhaHash: usado só pelo login, para conferir a senha.
  buscarPorEmailComSenha(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      select: { ...selectUsuarioPublico, senhaHash: true },
    })
  },

  buscarPorId(id: string): Promise<UsuarioPublico | null> {
    return prisma.usuario.findUnique({ where: { id }, select: selectUsuarioPublico })
  },

  async existeEmail(email: string): Promise<boolean> {
    const total = await prisma.usuario.count({ where: { email } })
    return total > 0
  },

  criar(data: CriarUsuarioData): Promise<UsuarioPublico> {
    return prisma.usuario.create({ data, select: selectUsuarioPublico })
  },
}
