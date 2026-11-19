import { AppError } from "../../shared/AppError"
import type { AtualizarEstoqueInput, PerfilArtesao, PerfilArtesaoInput, ResumoPainelArtesao } from "../../shared/types/artesao"
import type { Endereco } from "../../shared/types/pedido"
import type { Produto, ProdutoInput } from "../../shared/types/produto"
import type { FormaPagamentoSalva, MinhaConta } from "../../shared/types/usuario"
import { artesaosRepository } from "../repositories/artesaos.repository"
import { filtrosRepository } from "../repositories/filtros.repository"
import { produtosRepository, type DadosPeca } from "../repositories/produtos.repository"
import { usuariosRepository } from "../repositories/usuarios.repository"

// Até esta quantidade a peça conta como "baixo estoque" (mesmo valor de frontend/src/constants/pedidos.ts).
const LIMITE_BAIXO_ESTOQUE = 1

const ENDERECO_VAZIO: Endereco = { cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" }

// Foto das peças novas, enquanto o envio de fotos não existe (precisa de um serviço de armazenamento).
const FOTO_PADRAO_PECA = "https://picsum.photos/seed/origem-peca-nova/600/600"

// Id do perfil de artesão do usuário logado. A rota já exige o perfil "artesao" (roleMiddleware).
async function artesaoDoUsuario(usuarioId: string): Promise<string> {
  const artesaoId = await artesaosRepository.buscarIdPorUsuario(usuarioId)
  if (!artesaoId) throw new AppError(404, "NOT_FOUND", "Perfil de artesão não encontrado.")
  return artesaoId
}

async function perfilDoUsuario(usuarioId: string): Promise<PerfilArtesao> {
  const perfil = await artesaosRepository.buscarPerfilDoUsuario(usuarioId)
  if (!perfil) throw new AppError(404, "NOT_FOUND", "Perfil de artesão não encontrado.")
  return perfil
}

/**
 * Converte o formulário de peça nos campos do banco.
 * Confere se categoria, técnica e material existem (senão 400, em vez de erro do banco).
 * - medidas: "largura × altura × profundidade" + "cm" (o mesmo formato que o frontend lê na edição);
 * - etiquetas: "Peça única" (quando for) e o nome do material, como as peças do seed;
 * - peça única tem sempre 1 unidade;
 * - "Enviar para análise" manda para a curadoria; senão fica como rascunho.
 */
async function montarDadosPeca(input: ProdutoInput): Promise<DadosPeca> {
  const [categoria, tecnica, material] = await Promise.all([
    filtrosRepository.buscarCategoria(input.categoria),
    filtrosRepository.buscarTecnica(input.tecnica),
    filtrosRepository.buscarMaterial(input.material),
  ])
  if (!categoria) throw new AppError(400, "VALIDATION", "Categoria inválida.")
  if (!tecnica) throw new AppError(400, "VALIDATION", "Técnica inválida.")
  if (!material) throw new AppError(400, "VALIDATION", "Material inválido.")

  const lados = [input.largura, input.altura, input.profundidade]
  const medidas = lados.some((lado) => lado) ? `${lados.join(" × ")}cm` : ""
  const tags = input.pecaUnica ? ["Peça única", material.label] : [material.label]

  return {
    titulo: input.titulo,
    tags,
    medidas,
    preco: input.preco,
    estoque: input.pecaUnica ? 1 : input.estoque,
    pecaUnica: input.pecaUnica,
    status: input.enviarParaAnalise ? "emAnalise" : "rascunho",
    descricao: input.descricao,
    cuidados: input.cuidadosEnvio,
    peso: input.peso || null,
    prazoPostagem: input.prazoPostagem,
    embalagem: input.embalagem,
    categoriaId: categoria.id,
    tecnicaId: tecnica.id,
    materialId: material.id,
  }
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

  /** POST /minha-conta/produtos: nova peça, como rascunho ou já enviada para a curadoria. */
  async criarProduto(usuarioId: string, input: ProdutoInput): Promise<Produto> {
    const perfil = await perfilDoUsuario(usuarioId)
    const dados = await montarDadosPeca(input)
    return produtosRepository.criar({ ...dados, artesaoId: perfil.id, regiaoId: perfil.regiao, imagemUrl: FOTO_PADRAO_PECA })
  },

  /**
   * PUT /minha-conta/produtos/:id: troca os dados da peça.
   * Toda edição volta para a curadoria (ou para rascunho): o admin confere de novo antes de
   * a peça aparecer na vitrine. Peça de outro artesão responde 404.
   */
  async editarProduto(usuarioId: string, produtoId: string, input: ProdutoInput): Promise<Produto> {
    const artesaoId = await artesaoDoUsuario(usuarioId)
    const peca = await produtosRepository.buscarDoArtesao(produtoId, artesaoId)
    if (!peca) throw new AppError(404, "NOT_FOUND", "Peça não encontrada no seu catálogo.")
    if (peca.status === "vendida") throw new AppError(409, "CONFLICT", "Esta peça já foi vendida e não pode ser editada.")

    return produtosRepository.editar(produtoId, await montarDadosPeca(input))
  },

  /**
   * DELETE /minha-conta/produtos/:id: apaga a peça.
   * Peça que já está em algum pedido não pode sumir (o pedido guarda a ligação com ela): 409.
   */
  async excluirProduto(usuarioId: string, produtoId: string): Promise<void> {
    const artesaoId = await artesaoDoUsuario(usuarioId)
    const peca = await produtosRepository.buscarDoArtesao(produtoId, artesaoId)
    if (!peca) throw new AppError(404, "NOT_FOUND", "Peça não encontrada no seu catálogo.")

    if ((await produtosRepository.contarItensPedido(produtoId)) > 0) {
      throw new AppError(409, "CONFLICT", "Esta peça já foi vendida, por isso não pode ser excluída. Você pode escondê-la da vitrine em Meu estoque.")
    }
    await produtosRepository.excluir(produtoId)
  },

  /** GET /minha-conta/perfil: o perfil do artesão logado, em qualquer status. */
  async perfil(usuarioId: string): Promise<PerfilArtesao> {
    return perfilDoUsuario(usuarioId)
  },

  /** PUT /minha-conta/perfil: salva o perfil e devolve como ficou. */
  async atualizarPerfil(usuarioId: string, input: PerfilArtesaoInput): Promise<PerfilArtesao> {
    await perfilDoUsuario(usuarioId) // 404 se o usuário não tiver perfil de artesão
    await artesaosRepository.atualizarPerfil(usuarioId, input)
    return perfilDoUsuario(usuarioId)
  },
}
