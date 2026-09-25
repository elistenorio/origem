import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"

// GET /api/minha-conta/pedidos: "Meus pedidos" da compradora logada, do mais recente para o mais antigo.
export async function GET() {
  const usuario = db.usuarios.find((u) => u.id === sessaoDemo.usuarioId)
  if (!usuario) return fail(404, "NOT_FOUND", "Conta não encontrada.")

  const pedidos = db.pedidos
    .filter((p) => p.comprador.email === usuario.email)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  return ok(pedidos)
}
