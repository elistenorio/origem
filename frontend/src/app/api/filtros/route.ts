import { ok } from "@/app/api/_lib/responses"
import { CATEGORIAS } from "@/constants/categorias"
import { MATERIAIS } from "@/constants/materiais"
import { REGIOES } from "@/constants/regioes"
import { TECNICAS } from "@/constants/tecnicas"
import type { OpcoesFiltro } from "@/types/produto"

// GET /api/filtros: opções dos filtros da vitrine.
// Na Avaliação 1 as listas são fixas (constants/); na Avaliação 2 viram tabelas do banco.
export async function GET() {
  const opcoes: OpcoesFiltro = { categorias: CATEGORIAS, tecnicas: TECNICAS, materiais: MATERIAIS, regioes: REGIOES }
  return ok(opcoes)
}
