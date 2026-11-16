import bcrypt from "bcryptjs"
import { AppError } from "../../shared/AppError"
import { gerarToken } from "../../shared/jwt"
import { normalizarEmail } from "../../shared/validacao"
import { usuariosRepository, type UsuarioPublico } from "../repositories/usuarios.repository"

type LoginResultado = {
  token: string
  usuario: UsuarioPublico
}

export const authService = {
  // Confere e-mail e senha e gera o JWT. O controller é quem grava o token no cookie.
  async login(emailInformado: string, senha: string): Promise<LoginResultado> {
    const usuario = await usuariosRepository.buscarPorEmailComSenha(normalizarEmail(emailInformado))

    // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails têm conta.
    const senhaConfere = usuario ? await bcrypt.compare(senha, usuario.senhaHash) : false
    if (!usuario || !senhaConfere) {
      throw new AppError(401, "UNAUTHORIZED", "E-mail ou senha incorretos.")
    }

    if (usuario.status === "suspenso") {
      throw new AppError(403, "FORBIDDEN", "Esta conta está suspensa. Fale com o suporte do Origem.")
    }

    const token = gerarToken({ id: usuario.id, perfil: usuario.perfil })

    // Tira a senha do objeto antes de devolver.
    const { senhaHash: _senhaHash, ...publico } = usuario
    return { token, usuario: publico }
  },

  // GET /auth/me: dados de quem está logado (o id vem do token).
  async usuarioLogado(id: string): Promise<UsuarioPublico> {
    const usuario = await usuariosRepository.buscarPorId(id)
    // Token válido, mas o usuário não existe mais (ex.: banco recriado pelo seed).
    if (!usuario) {
      throw new AppError(401, "UNAUTHORIZED", "Sessão inválida. Faça login novamente.")
    }
    return usuario
  },
}
