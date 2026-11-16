import { create } from "zustand"
import type { Usuario } from "@/types/usuario"

// Usuário logado, compartilhado por todas as telas (cabeçalho, áreas protegidas, formulários).
// Sem `persist`: quem diz se a sessão vale é o cookie httpOnly, conferido no backend (GET /auth/me)
// ao abrir o site. O store não faz requisições: quem chama a API é o hook useSessao.
type AuthStore = {
  usuario: Usuario | null
  verificado: boolean // false até a primeira resposta de /auth/me (as telas protegidas esperam)
  definirUsuario: (usuario: Usuario | null) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  usuario: null,
  verificado: false,
  definirUsuario: (usuario) => set({ usuario, verificado: true }),
}))
