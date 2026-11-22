import { api } from "./api"
import type { CadastroCompradorInput, Usuario } from "@/types/usuario"

// Login e cadastro.
// O token fica num cookie httpOnly que o navegador guarda e envia sozinho (withCredentials no api.ts):
// o JavaScript nunca vê o token. Por isso, para saber quem está logado, a tela pergunta ao backend (me).
export const authService = {
  /** POST /auth/login: confere e-mail e senha; o backend grava o cookie e devolve o usuário. */
  async login(email: string, senha: string) {
    const response = await api.post<Usuario>("/auth/login", { email, senha })
    return response.data
  },

  /** POST /auth/logout: o backend apaga o cookie. */
  async logout() {
    await api.post("/auth/logout")
  },

  /** GET /auth/me: usuário dono do cookie. Sem login, a API responde 401 (ApiError). */
  async me() {
    const response = await api.get<Usuario>("/auth/me")
    return response.data
  },

  /** POST /usuarios: cadastro de comprador. Não faz login sozinho. */
  async cadastrar(dados: CadastroCompradorInput) {
    const response = await api.post<Usuario>("/usuarios", dados)
    return response.data
  },
}
