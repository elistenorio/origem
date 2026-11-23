import bcrypt from "bcryptjs"
import { AppError } from "../../shared/AppError"
import type { Endereco } from "../../shared/types/pedido"
import type { CartaoInput, DadosPessoaisInput, MinhaConta, Preferencias } from "../../shared/types/usuario"
import { usuariosRepository } from "../repositories/usuarios.repository"
import { minhaContaService } from "./minhaConta.service"

const SALT_ROUNDS = 10
const MAX_CARTOES = 5

const mascararCpf = (digitos: string) => `***.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-**`

async function conferirSenha(usuarioId: string, senha: string, mensagem = "A senha não confere.") {
  const usuario = await usuariosRepository.buscarSenhaHash(usuarioId)
  if (!usuario) throw new AppError(401, "UNAUTHORIZED", "Sessão inválida. Faça login novamente.")
  if (!(await bcrypt.compare(senha, usuario.senhaHash))) throw new AppError(400, "VALIDATION", mensagem)
  return usuario
}

export const contaService = {
  async atualizarDados(usuarioId: string, input: DadosPessoaisInput): Promise<MinhaConta> {
    await usuariosRepository.atualizarConta(usuarioId, {
      nome: input.nome,
      telefone: input.telefone || null,
      ...(input.cpf !== undefined ? { cpf: input.cpf ? mascararCpf(input.cpf) : null } : {}),
    })
    return minhaContaService.conta(usuarioId)
  },

  async salvarEndereco(usuarioId: string, endereco: Endereco): Promise<MinhaConta> {
    await usuariosRepository.atualizarConta(usuarioId, { endereco, cidade: `${endereco.cidade}/${endereco.estado}` })
    return minhaContaService.conta(usuarioId)
  },

  async alterarSenha(usuarioId: string, senhaAtual: string, novaSenha: string): Promise<void> {
    await conferirSenha(usuarioId, senhaAtual, "A senha atual não confere.")
    await usuariosRepository.atualizarConta(usuarioId, { senhaHash: await bcrypt.hash(novaSenha, SALT_ROUNDS) })
  },

  async salvarPreferencias(usuarioId: string, preferencias: Preferencias): Promise<MinhaConta> {
    await usuariosRepository.atualizarConta(usuarioId, { preferencias })
    return minhaContaService.conta(usuarioId)
  },

  async adicionarCartao(usuarioId: string, cartao: CartaoInput): Promise<MinhaConta> {
    const { formasPagamento } = await minhaContaService.conta(usuarioId)
    if (formasPagamento.length >= MAX_CARTOES) throw new AppError(409, "CONFLICT", `Você pode guardar até ${MAX_CARTOES} formas de pagamento.`)
    const nova = { titulo: `Cartão ${cartao.bandeira}`, detalhe: `final ${cartao.ultimosDigitos}` }
    await usuariosRepository.atualizarConta(usuarioId, { formasPagamento: [...formasPagamento, nova] })
    return minhaContaService.conta(usuarioId)
  },

  async removerCartao(usuarioId: string, indice: number): Promise<MinhaConta> {
    const { formasPagamento } = await minhaContaService.conta(usuarioId)
    if (indice < 0 || indice >= formasPagamento.length) throw new AppError(404, "NOT_FOUND", "Forma de pagamento não encontrada.")
    await usuariosRepository.atualizarConta(usuarioId, { formasPagamento: formasPagamento.filter((_, i) => i !== indice) })
    return minhaContaService.conta(usuarioId)
  },

  async excluirConta(usuarioId: string, senha: string): Promise<void> {
    const usuario = await usuariosRepository.buscarSenhaHash(usuarioId)
    if (!usuario) throw new AppError(401, "UNAUTHORIZED", "Sessão inválida. Faça login novamente.")
    if (usuario.perfil !== "comprador") {
      throw new AppError(409, "CONFLICT", "Contas de artesão e de administrador são encerradas pelo suporte do Origem.")
    }
    await conferirSenha(usuarioId, senha)
    await usuariosRepository.excluir(usuarioId)
  },
}
