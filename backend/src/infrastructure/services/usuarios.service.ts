import bcrypt from "bcryptjs"
import { AppError } from "../../shared/AppError"
import { normalizarEmail } from "../../shared/validacao"
import { usuariosRepository, type UsuarioPublico } from "../repositories/usuarios.repository"

export type CadastroCompradorInput = {
  nome: string
  email: string
  senha: string
}

const SALT_ROUNDS = 10

export const usuariosService = {
  // POST /usuarios: cadastro público. Sempre cria um comprador (artesão e admin não se cadastram por aqui).
  async cadastrarComprador(input: CadastroCompradorInput): Promise<UsuarioPublico> {
    const email = normalizarEmail(input.email)

    if (await usuariosRepository.existeEmail(email)) {
      throw new AppError(409, "CONFLICT", "Já existe uma conta com este e-mail.")
    }

    const senhaHash = await bcrypt.hash(input.senha, SALT_ROUNDS)

    return usuariosRepository.criar({
      nome: input.nome.trim(),
      email,
      senhaHash,
      perfil: "comprador",
    })
  },
}
