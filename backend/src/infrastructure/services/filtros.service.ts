import type { OpcoesFiltro } from "../../shared/types/produto"
import { filtrosRepository } from "../repositories/filtros.repository"

export const filtrosService = {
  // GET /filtros: opções de categoria, técnica, material e região (tabelas do banco).
  listar(): Promise<OpcoesFiltro> {
    return filtrosRepository.listarOpcoes()
  },
}
