import { RequireAuth } from "@/components/autenticacao/RequireAuth"

// Painel do administrador: só o perfil "admin".
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth perfis={["admin"]}>{children}</RequireAuth>
}
