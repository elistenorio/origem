import type { StatusArtesao, StatusProduto, StatusUsuario } from "@prisma/client"
import { AppError } from "../../shared/AppError"
import type { TokenPayload } from "../../shared/jwt"
import { paginated, type Pagination } from "../../shared/pagination"
import type { Paginated } from "../../shared/types/api"
import type { Artesao } from "../../shared/types/artesao"
import type { Produto } from "../../shared/types/produto"
import { produtosCache } from "../cache/produtos.cache"
import { adminRepository } from "../repositories/admin.repository"
import { artesaosRepository } from "../repositories/artesaos.repository"
import { produtosRepository } from "../repositories/produtos.repository"
import { usuariosRepository, type UsuarioPublico } from "../repositories/usuarios.repository"

type Filtros<S> = { busca?: string; status?: S }

async function autor(usuario: TokenPayload): Promise<string> {
  return (await usuariosRepository.buscarPorId(usuario.id))?.nome ?? "Equipe Origem"
}

export const gestaoService = {
  async artesaos(filtros: Filtros<StatusArtesao>, paginacao: Pagination): Promise<Paginated<Artesao>> {
    const { itens, total } = await artesaosRepository.listarTodos(filtros, paginacao)
    return paginated(itens, total, paginacao)
  },

  async clientes(filtros: Filtros<StatusUsuario>, paginacao: Pagination): Promise<Paginated<UsuarioPublico>> {
    const { itens, total } = await usuariosRepository.listarClientes(filtros, paginacao)
    return paginated(itens, total, paginacao)
  },

  async produtos(filtros: Filtros<StatusProduto>, paginacao: Pagination): Promise<Paginated<Produto>> {
    const { itens, total } = await produtosRepository.listarTodos(filtros, paginacao)
    return paginated(itens, total, paginacao)
  },

  async alterarStatusArtesao(id: string, status: "publicado" | "indisponivel", usuario: TokenPayload): Promise<void> {
    const artesao = await artesaosRepository.buscarNomeEStatus(id)
    if (!artesao) throw new AppError(404, "NOT_FOUND", "Artesão não encontrado.")

    const de = status === "indisponivel" ? "publicado" : "indisponivel"
    const conflito = new AppError(409, "CONFLICT", status === "indisponivel" ? "Só é possível suspender um artesão publicado." : "Só é possível reativar um artesão suspenso.")
    if (artesao.status !== de) throw conflito
    if (!(await artesaosRepository.alterarStatus(id, de, status))) throw conflito

    const acao = status === "indisponivel" ? "suspendeu" : "reativou"
    await adminRepository.criarAtividade(await autor(usuario), `${acao} o artesão “${artesao.nome}”`)
    await produtosCache.invalidar()
  },

  async alterarStatusCliente(id: string, status: StatusUsuario, usuario: TokenPayload): Promise<void> {
    const cliente = await usuariosRepository.buscarStatus(id)
    if (!cliente || cliente.perfil !== "comprador") throw new AppError(404, "NOT_FOUND", "Cliente não encontrado.")

    const de = status === "suspenso" ? "ativo" : "suspenso"
    const conflito = new AppError(409, "CONFLICT", status === "suspenso" ? "Este cliente já está suspenso." : "Este cliente já está ativo.")
    if (cliente.status !== de) throw conflito
    if (!(await usuariosRepository.alterarStatus(id, de, status))) throw conflito

    const acao = status === "suspenso" ? "suspendeu" : "reativou"
    await adminRepository.criarAtividade(await autor(usuario), `${acao} o cliente ${cliente.email}`)
  },
}
