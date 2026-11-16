import { RequireAuth } from "@/components/autenticacao/RequireAuth"

// Meus pedidos: qualquer usuário logado (cada um vê só os próprios pedidos).
export default function PedidosLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}
