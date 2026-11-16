import { RequireAuth } from "@/components/autenticacao/RequireAuth"

// Minha conta: qualquer usuário logado.
export default function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}
