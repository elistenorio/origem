import { prisma } from "../prisma/client"
import type { OpcaoFiltro, OpcoesFiltro } from "../../shared/types/produto"

// Tabela { id, label } → opção de filtro { value, label }.
const paraOpcao = (linha: { id: string; label: string }): OpcaoFiltro => ({ value: linha.id, label: linha.label })

const ORDEM = { ordem: "asc" } as const

export const filtrosRepository = {
  async listarOpcoes(): Promise<OpcoesFiltro> {
    const [categorias, tecnicas, materiais, regioes] = await Promise.all([
      prisma.categoria.findMany({ orderBy: ORDEM }),
      prisma.tecnica.findMany({ orderBy: ORDEM }),
      prisma.material.findMany({ orderBy: ORDEM }),
      prisma.regiao.findMany({ orderBy: ORDEM }),
    ])
    return {
      categorias: categorias.map(paraOpcao),
      tecnicas: tecnicas.map(paraOpcao),
      materiais: materiais.map(paraOpcao),
      regioes: regioes.map(paraOpcao),
    }
  },

  async buscarTecnica(id: string) {
    return prisma.tecnica.findUnique({ where: { id } })
  },
}
