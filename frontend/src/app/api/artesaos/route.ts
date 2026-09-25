import type { NextRequest } from "next/server"
import { db } from "@/mocks/db"
import { ok } from "@/app/api/_lib/responses"
import { paginate, readPagination } from "@/app/api/_lib/pagination"
import { TECNICAS } from "@/constants/tecnicas"
import { normalizeText } from "@/utils/normalizeText"

// GET /api/artesaos: lista de artesãos com busca, filtros e paginação. Só artesãos publicados.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  let lista = db.artesaos.filter((a) => a.status === "publicado")

  const busca = normalizeText(params.get("busca") ?? "")
  if (busca) lista = lista.filter((a) => normalizeText(`${a.nome} ${a.cidade} ${a.oficio}`).includes(busca))

  const regiao = params.get("regiao")
  if (regiao) lista = lista.filter((a) => a.regiao === regiao)

  const categoria = params.get("categoria")
  if (categoria) lista = lista.filter((a) => a.categorias.includes(categoria))

  // O filtro manda o id da técnica ("pintura-mao"); o artesão guarda o rótulo ("Pintura à mão").
  const tecnica = TECNICAS.find((t) => t.value === params.get("tecnica"))?.label
  if (tecnica) lista = lista.filter((a) => a.tecnicas.some((t) => normalizeText(t) === normalizeText(tecnica)))

  const { page, pageSize } = readPagination(params)
  return ok(paginate(lista, page, pageSize))
}
