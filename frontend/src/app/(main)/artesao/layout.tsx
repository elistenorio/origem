import { RequireAuth } from "@/components/autenticacao/RequireAuth"

// Área do artesão (dashboard, catálogo, estoque, perfil): só o perfil "artesao".
export default function ArtesaoLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth perfis={["artesao"]}>{children}</RequireAuth>
}
