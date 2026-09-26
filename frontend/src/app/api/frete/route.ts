import type { NextRequest } from "next/server"
import { fail, ok } from "@/app/api/_lib/responses"
import type { OpcaoFrete } from "@/types/frete"

// GET /api/frete?cep=50030-170: opções de frete (PAC e SEDEX) para o CEP.
// Simulação: CEPs de Pernambuco (começam de 50 a 56) pagam menos.
// Na Avaliação 2, o backend troca isto por uma consulta aos Correios (ou tabela própria).
export async function GET(request: NextRequest) {
  const cep = (request.nextUrl.searchParams.get("cep") ?? "").replace(/\D/g, "")
  if (cep.length !== 8) return fail(400, "VALIDATION", "Informe um CEP válido com 8 números.")

  const prefixo = Number(cep.slice(0, 2))
  const local = prefixo >= 50 && prefixo <= 56

  const opcoes: OpcaoFrete[] = [
    { modalidade: "pac", nome: "PAC", valor: local ? 18.9 : 32.4, prazo: local ? "6 a 8 dias úteis" : "8 a 12 dias úteis" },
    { modalidade: "sedex", nome: "SEDEX", valor: local ? 27.5 : 49.9, prazo: local ? "2 a 4 dias úteis" : "4 a 6 dias úteis" },
  ]
  return ok(opcoes)
}
