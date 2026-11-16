import type { PerfilUsuario } from "@/types/usuario"

// Para onde cada perfil vai depois de entrar (e o link "Minha conta" do cabeçalho).
export const INICIO_POR_PERFIL: Record<PerfilUsuario, string> = {
  comprador: "/minha-conta",
  artesao: "/artesao/dashboard",
  admin: "/admin",
}
