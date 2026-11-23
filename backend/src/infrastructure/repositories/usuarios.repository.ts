import type { PerfilUsuario, Prisma, StatusUsuario } from "@prisma/client"
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

  /** Usuário com os dados de "Minha conta" (cpf, telefone, endereço, formas de pagamento). */
  buscarContaPorId(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
      select: { ...selectUsuarioPublico, cpf: true, telefone: true, endereco: true, formasPagamento: true },
    })
  },

  async existeEmail(email: string): Promise<boolean> {
    const total = await prisma.usuario.count({ where: { email } })
    return total > 0
  },

  criar(data: CriarUsuarioData): Promise<UsuarioPublico> {
    return prisma.usuario.create({ data, select: selectUsuarioPublico })
  },

  async criarArtesao(dados: {
    usuario: CriarUsuarioData & { cidade: string; telefone: string | null }
    artesao: Omit<Prisma.ArtesaoUncheckedCreateInput, "usuarioId">
    notificacao: { titulo: string; descricao: string }
  }): Promise<UsuarioPublico> {
    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({ data: dados.usuario, select: selectUsuarioPublico })
      await tx.artesao.create({ data: { ...dados.artesao, usuarioId: usuario.id } })
      await tx.notificacao.create({ data: dados.notificacao })
      return usuario
    })
  },

  async buscarStatus(id: string) {
    return prisma.usuario.findUnique({ where: { id }, select: { status: true, perfil: true, nome: true, email: true } })
  },

  async listarClientes(
    filtros: { busca?: string; status?: StatusUsuario },
    paginacao: { skip: number; take: number },
  ): Promise<{ itens: UsuarioPublico[]; total: number }> {
    const contem = filtros.busca ? { contains: filtros.busca, mode: "insensitive" as const } : undefined
    const where: Prisma.UsuarioWhereInput = {
      perfil: "comprador",
      status: filtros.status,
      OR: contem ? [{ nome: contem }, { email: contem }, { cidade: contem }] : undefined,
    }
    const [total, itens] = await prisma.$transaction([
      prisma.usuario.count({ where }),
      prisma.usuario.findMany({ where, select: selectUsuarioPublico, orderBy: [{ criadoEm: "desc" }, { id: "desc" }], skip: paginacao.skip, take: paginacao.take }),
    ])
    return { itens, total }
  },

  async alterarStatus(id: string, de: StatusUsuario, para: StatusUsuario): Promise<boolean> {
    const { count } = await prisma.usuario.updateMany({ where: { id, perfil: "comprador", status: de }, data: { status: para } })
    return count > 0
  },
}
