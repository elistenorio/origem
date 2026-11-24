import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import { AppError } from "../../shared/AppError"
import type { CadastroArtesaoInput } from "../../shared/types/artesao"
import { filtrosRepository } from "../repositories/filtros.repository"
import { usuariosRepository, type UsuarioPublico } from "../repositories/usuarios.repository"

export type CadastroCompradorInput = {
  nome: string
  email: string
  senha: string
}

const SALT_ROUNDS = 10
const FOTO_PADRAO_ARTESAO = "https://picsum.photos/seed/origem-artesao-novo/600/800"
const TAMANHO_BIO = 160

const emailEmUso = () => new AppError(409, "CONFLICT", "Já existe uma conta com este e-mail.")

// E-mail é comparado sem diferenciar maiúsculas e sem espaços nas pontas.
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

function emailDuplicado(erro: unknown): boolean {
  return erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002"
}

function resumir(texto: string): string {
  return texto.length <= TAMANHO_BIO ? texto : `${texto.slice(0, TAMANHO_BIO - 1).trimEnd()}…`
}

export const usuariosService = {
  // POST /usuarios: cadastro público. Sempre cria um comprador (artesão e admin não se cadastram por aqui).
  async cadastrarComprador(input: CadastroCompradorInput): Promise<UsuarioPublico> {
    const email = normalizarEmail(input.email)

    if (await usuariosRepository.existeEmail(email)) throw emailEmUso()

    const senhaHash = await bcrypt.hash(input.senha, SALT_ROUNDS)

    try {
      return await usuariosRepository.criar({
        nome: input.nome.trim(),
        email,
        senhaHash,
        perfil: "comprador",
      })
    } catch (erro) {
      if (emailDuplicado(erro)) throw emailEmUso()
      throw erro
    }
  },

  async cadastrarArtesao(input: CadastroArtesaoInput): Promise<UsuarioPublico> {
    const email = normalizarEmail(input.email)
    if (await usuariosRepository.existeEmail(email)) throw emailEmUso()

    const [categoria, regiao] = await Promise.all([
      filtrosRepository.buscarCategoria(input.categoria),
      filtrosRepository.buscarRegiao(input.regiao),
    ])
    if (!categoria) throw new AppError(400, "VALIDATION", "Área de atuação inválida.")
    if (!regiao) throw new AppError(400, "VALIDATION", "Região inválida.")

    const senhaHash = await bcrypt.hash(input.senha, SALT_ROUNDS)
    const nomePublico = input.nomeArtistico || input.nome
    const ouNulo = (texto: string) => texto || null

    try {
      return await usuariosRepository.criarArtesao({
        usuario: {
          nome: input.nome,
          email,
          senhaHash,
          perfil: "artesao",
          cidade: `${input.cidade}/${input.estado}`,
          telefone: ouNulo(input.telefone),
        },
        artesao: {
          nome: nomePublico,
          oficio: input.oficio,
          cidade: input.cidade,
          estado: input.estado,
          bio: resumir(input.trabalho || input.historia),
          historia: input.historia,
          citacao: "",
          trabalho: ouNulo(input.trabalho),
          origemTrabalho: ouNulo(input.origemTrabalho),
          gostaDeFazer: ouNulo(input.gostaDeFazer),
          fotoUrl: FOTO_PADRAO_ARTESAO,
          tempoAtuacao: ouNulo(input.tempoAtuacao),
          comprovacoes: input.comprovacoes,
          tecnicas: input.tecnicas,
          categorias: [categoria.id],
          status: "emAnalise",
          regiaoId: regiao.id,
        },
        notificacao: {
          titulo: "Novo artesão cadastrado",
          descricao: `${nomePublico}, de ${input.cidade}/${input.estado}, enviou o cadastro para análise.`,
        },
      })
    } catch (erro) {
      if (emailDuplicado(erro)) throw emailEmUso()
      throw erro
    }
  },
}
