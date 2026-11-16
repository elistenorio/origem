"use client"

import { ApiError } from "@/services/api"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/authStore"
import type { CadastroCompradorInput, Usuario } from "@/types/usuario"

// Sessão do usuário: liga o authService (API) ao authStore (estado das telas).
// Uso: const { usuario, verificado, entrar, sair, cadastrar } = useSessao()
export function useSessao() {
  const usuario = useAuthStore((s) => s.usuario)
  const verificado = useAuthStore((s) => s.verificado)
  const definirUsuario = useAuthStore((s) => s.definirUsuario)

  /** Confere no backend se o cookie ainda vale. Chamado uma vez ao abrir o site (SessionLoader). */
  async function carregar() {
    try {
      definirUsuario(await authService.me())
    } catch (erro) {
      // 401 = ninguém logado. Qualquer outro erro (ex.: backend fora do ar) também conta como deslogado.
      if (!(erro instanceof ApiError)) console.error(erro)
      definirUsuario(null)
    }
  }

  /** Login. Erros (senha errada, conta suspensa) chegam como ApiError para a tela mostrar a mensagem. */
  async function entrar(email: string, senha: string): Promise<Usuario> {
    const logado = await authService.login(email, senha)
    definirUsuario(logado)
    return logado
  }

  /** Cadastra o comprador e já entra na conta. */
  async function cadastrar(dados: CadastroCompradorInput): Promise<Usuario> {
    await authService.cadastrar(dados)
    return entrar(dados.email, dados.senha)
  }

  /** Logout. Mesmo se a API falhar, a tela passa a tratar o usuário como deslogado. */
  async function sair() {
    try {
      await authService.logout()
    } finally {
      definirUsuario(null)
    }
  }

  return { usuario, verificado, carregar, entrar, cadastrar, sair }
}
