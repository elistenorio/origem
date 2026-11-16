import { AppError } from "../../shared/AppError"
import type { AtualizarEstoqueInput, ResumoPainelArtesao } from "../../shared/types/artesao"
import type { Endereco } from "../../shared/types/pedido"
import type { Produto } from "../../shared/types/produto"
import type { FormaPagamentoSalva, MinhaConta } from "../../shared/types/usuario"
import { artesaosRepository } from "../repositories/artesaos.repository"
import { produtosRepository } from "../repositories/produtos.repository"
import { usuariosRepository } from "../repositories/usuarios.repository"

// Até esta quantidade a peça conta como "baixo estoque" (mesmo valor de frontend/src/constants/pedidos.ts).
const LIMITE_BAIXO_ESTOQUE = 1

const ENDERECO_VAZIO: Endereco = { cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" }

// Id do perfil de artesão do usuário logado. A rota já exige o perfil "artesao" (roleMiddleware).
async function artesaoDoUsuario(usuarioId: string): Promise<string> {
  const artesaoId = await artesaosRepository.buscarIdPorUsuario(usuarioId)
  if (!artesaoId) throw new AppError(404, "NOT_FOUND", "Perfil de artesão não encontrado.")
  return artesaoId
}

export const minhaContaService = {
  // GET /minha-conta: dados do usuário logado. Campos ainda não preenchidos voltam vazios.
  async conta(usuarioId: string): Promise<MinhaConta> {
    const u = await usuariosRepository.buscarContaPorId(usuarioId)
    if (!u) throw new AppError(401, "UNAUTHORIZED", "Sessão inválida. Faça login novamente.")
    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfil: u.perfil,
      status: u.status,
      cidade: u.cidade,
      criadoEm: u.criadoEm,
      cpf: u.cpf ?? "",
      telefone: u.telefone ?? "",
      endereco: { ...ENDERECO_VAZIO, ...((u.endereco as Partial<Endereco> | null) ?? {}) },
      formasPagamento: (u.formasPagamento as FormaPagamentoSalva[] | null) ?? [],
    }
  },

  // GET /minha-conta/produtos: todas as peças do artesão logado, em qualquer status.
  async produtos(usuarioId: string): Promise<Produto[]> {
    return produtosRepository.listarDoArtesao(await artesaoDoUsuario(usuarioId))
  },

  // GET /minha-conta/resumo
  async resumo(usuarioId: string): Promise<ResumoPainelArtesao> {
    const artesaoId = await artesaoDoUsuario(usuarioId)
    const [minhas, vendidas] = await Promise.all([
      produtosRepository.listarDoArtesao(artesaoId),
      produtosRepository.contarVendidasDoArtesao(artesaoId),
    ])
    const comStatus = (status: string) => minhas.filter((p) => p.status === status).length

    // Estoque: só as peças que estão ou estiveram na vitrine (publicadas ou escondidas).
    const ativas = minhas.filter((p) => p.status === "publicado" || p.status === "indisponivel")

    return {
      catalogo: {
        publicadas: comStatus("publicado"),
        emAnalise: comStatus("emAnalise"),
        vendidas,
        indisponiveis: comStatus("indisponivel"),
      },
      estoque: {
        disponiveis: ativas.filter((p) => p.estoque > LIMITE_BAIXO_ESTOQUE).length,
        baixoEstoque: ativas.filter((p) => p.estoque > 0 && p.estoque <= LIMITE_BAIXO_ESTOQUE).length,
        esgotadas: ativas.filter((p) => p.estoque === 0).length,
      },
    }
  },

  /**
   * PATCH /minha-conta/produtos/:id: estoque e/ou esconder/mostrar na vitrine.
   * Peça de outro artesão responde 404 (como se não existisse no catálogo dele).
   */
  async atualizarProduto(usuarioId: string, produtoId: string, input: AtualizarEstoqueInput): Promise<Produto> {
    const artesaoId = await artesaoDoUsuario(usuarioId)
    const peca = await produtosRepository.buscarDoArtesao(produtoId, artesaoId)
    if (!peca) throw new AppError(404, "NOT_FOUND", "Peça não encontrada no seu catálogo.")

    // Esconder/mostrar só vale para peças que já passaram pela curadoria.
    if (input.status && peca.status !== "publicado" && peca.status !== "indisponivel") {
      throw new AppError(409, "CONFLICT", "Só é possível esconder ou mostrar peças já publicadas.")
    }

    return produtosRepository.atualizarEstoqueEStatus(produtoId, input)
  },
}
