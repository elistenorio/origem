import { db } from "@/mocks/db"
import { fail, ok } from "@/app/api/_lib/responses"
import { sessaoDemo } from "@/app/api/_lib/session"
import type { MinhaConta } from "@/types/usuario"

// GET /api/minha-conta: dados da compradora logada (na Avaliação 1, a de demonstração).
export async function GET() {
  const usuario = db.usuarios.find((u) => u.id === sessaoDemo.usuarioId)
  const conta = db.contas.find((c) => c.usuarioId === sessaoDemo.usuarioId)

  if (!usuario || !conta) return fail(404, "NOT_FOUND", "Conta não encontrada.")

  const minhaConta: MinhaConta = {
    ...usuario,
    cpf: conta.cpf,
    telefone: conta.telefone,
    endereco: conta.endereco,
    formasPagamento: conta.formasPagamento,
  }
  return ok(minhaConta)
}
