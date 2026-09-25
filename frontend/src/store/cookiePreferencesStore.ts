import { create } from "zustand"
import { persist } from "zustand/middleware"

// Cookies "essenciais" não têm chave aqui: ficam sempre ativos, não são opção do usuário.
export type CookiePreferences = {
  desempenho: boolean
  funcionais: boolean
  marketing: boolean
}

const PADRAO: CookiePreferences = {
  desempenho: true,
  funcionais: true,
  marketing: false,
}

type CookiePreferencesStore = {
  preferencias: CookiePreferences
  definirPreferencias: (preferencias: CookiePreferences) => void
  recusarOpcionais: () => void
}

// Zustand + persist (localStorage) — mesmo padrão que o carrinho vai usar.
// Qualquer outra tela (ex.: um banner de cookies) pode ler esse mesmo estado depois.
export const useCookiePreferencesStore = create<CookiePreferencesStore>()(
  persist(
    (set) => ({
      preferencias: PADRAO,
      definirPreferencias: (preferencias) => set({ preferencias }),
      recusarOpcionais: () => set({ preferencias: { desempenho: false, funcionais: false, marketing: false } }),
    }),
    { name: "origem-cookie-preferencias" },
  ),
)
