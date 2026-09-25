import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { ok } from "@/app/api/_lib/responses"
import { paginate, readPagination } from "@/app/api/_lib/pagination"
import { normalizeText } from "@/utils/normalizeText"

// GET /api/produtos: vitrine com busca, filtros, ordenação e paginação. Só peças publicadas.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  let lista = db.produtos.filter((p) => p.status === "publicado")

  // Busca: ignora acentos e maiúsculas ("ceramica" acha "Cerâmica").
  const busca = normalizeText(params.get("busca") ?? "")
  if (busca) {
    lista = lista.filter((p) =>
      normalizeText([p.titulo, p.artesaoNome, p.cidade, p.categoria, p.tecnica, p.material, ...p.tags].join(" ")).includes(busca),
    )
  }

  const categoria = params.get("categoria")
  if (categoria) lista = lista.filter((p) => p.categoria === categoria)

  const tecnica = params.get("tecnica")
  if (tecnica) lista = lista.filter((p) => p.tecnica === tecnica)

  const material = params.get("material")
  if (material) lista = lista.filter((p) => p.material === material)

  const regiao = params.get("regiao")
  if (regiao) lista = lista.filter((p) => p.regiao === regiao)

  const artesaoId = params.get("artesaoId")
  if (artesaoId) lista = lista.filter((p) => p.artesaoId === artesaoId)

  const precoMin = Number(params.get("precoMin")) || 0
  const precoMax = Number(params.get("precoMax")) || Infinity
  lista = lista.filter((p) => p.preco >= precoMin && p.preco <= precoMax)

  if (params.get("disponivel") === "sim") lista = lista.filter((p) => p.estoque > 0)

  // "relevancia" (padrão) mantém a ordem do db.json.
  const ordenar = params.get("ordenar")
  if (ordenar === "menor_preco") lista.sort((a, b) => a.preco - b.preco)
  if (ordenar === "maior_preco") lista.sort((a, b) => b.preco - a.preco)
  if (ordenar === "recentes") lista.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  const { page, pageSize } = readPagination(params)
  return ok(paginate(lista, page, pageSize))
}
