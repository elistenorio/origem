import type { NextFunction, Request, Response } from "express"
import { minhaContaService } from "../../infrastructure/services/minhaConta.service"
import { pedidosService } from "../../infrastructure/services/pedidos.service"
import { AppError } from "../../shared/AppError"
import { FAIXAS_TEMPO_ATUACAO, type AtualizarEstoqueInput, type PerfilArtesaoInput } from "../../shared/types/artesao"
import { EMBALAGENS, PRAZOS_POSTAGEM, type ProdutoInput } from "../../shared/types/produto"
import { ehObjeto, texto, textoPreenchido } from "../../shared/validacao"

// Todas as rotas de /minha-conta passam pelo authMiddleware; isto é só para o TypeScript saber que há usuário.
function usuarioLogado(req: Request) {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")
  return req.user
}

const erro = (mensagem: string) => new AppError(400, "VALIDATION", mensagem)

// Medida ou peso: vazio, ou número positivo com vírgula ou ponto (ex.: "15", "1,2").
const MEDIDA = /^\d+([.,]\d+)?$/

/**
 * Lê e valida o corpo de POST e PUT /minha-conta/produtos.
 * Mesmas regras do formulário (frontend/src/utils/productForm.ts): o rascunho precisa só do básico;
 * para enviar à curadoria, a peça precisa estar completa.
 */
function lerProdutoInput(body: unknown): ProdutoInput {
  const b = ehObjeto(body) ? body : {}
  const input: ProdutoInput = {
    titulo: texto(b.titulo),
    categoria: texto(b.categoria),
    descricao: texto(b.descricao),
    material: texto(b.material),
    tecnica: texto(b.tecnica),
    altura: texto(b.altura),
    largura: texto(b.largura),
    profundidade: texto(b.profundidade),
    peso: texto(b.peso),
    pecaUnica: b.pecaUnica === true,
    estoque: typeof b.estoque === "number" ? b.estoque : NaN,
    preco: typeof b.preco === "number" ? b.preco : NaN,
    prazoPostagem: texto(b.prazoPostagem),
    embalagem: texto(b.embalagem),
    cuidadosEnvio: texto(b.cuidadosEnvio),
    enviarParaAnalise: b.enviarParaAnalise === true,
  }

  if (!input.titulo) throw erro("Informe o nome da peça.")
  if (input.titulo.length > 120) throw erro("O nome da peça pode ter até 120 letras.")
  if (!input.categoria) throw erro("Escolha a categoria.")
  if (!input.tecnica) throw erro("Escolha a técnica.")
  if (!input.material) throw erro("Escolha o material principal.")
  for (const [campo, valor] of [["altura", input.altura], ["largura", input.largura], ["profundidade", input.profundidade], ["peso", input.peso]]) {
    if (valor && !MEDIDA.test(valor)) throw erro(`Use só números em ${campo} (ex.: 15 ou 1,5).`)
  }
  if (!Number.isFinite(input.preco) || input.preco < 0) throw erro("O preço precisa ser um número, zero ou maior.")
  if (!Number.isInteger(input.estoque) || input.estoque < 0) throw erro("A quantidade precisa ser um número inteiro, zero ou maior.")
  if (!(PRAZOS_POSTAGEM as readonly string[]).includes(input.prazoPostagem)) throw erro("Prazo para postagem inválido.")
  if (!(EMBALAGENS as readonly string[]).includes(input.embalagem)) throw erro("Tipo de embalagem inválido.")

  if (input.enviarParaAnalise) {
    if (!input.descricao) throw erro("Escreva a descrição da peça.")
    if (!(input.preco > 0)) throw erro("Informe um preço maior que zero.")
    if (!input.pecaUnica && !(input.estoque > 0)) throw erro("Informe a quantidade disponível.")
  }
  return input
}

// Lista de textos do corpo; qualquer item que não seja texto é ignorado, e vazios saem.
function listaDeTextos(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.map(texto).filter(Boolean) : []
}

/** Lê e valida o corpo de PUT /minha-conta/perfil. */
function lerPerfilInput(body: unknown): PerfilArtesaoInput {
  const b = ehObjeto(body) ? body : {}
  if (!textoPreenchido(b.nome)) throw erro("Informe o nome que vai aparecer no Origem.")
  if (!textoPreenchido(b.cidade)) throw erro("Informe sua cidade.")
  const estado = texto(b.estado).toUpperCase()
  if (!/^[A-Z]{2}$/.test(estado)) throw erro("Informe o estado com 2 letras (ex.: PE).")
  if (!textoPreenchido(b.historia)) throw erro("Conte um pouco da sua história.")

  const telefone = texto(b.telefone)
  if (telefone && telefone.replace(/\D/g, "").length < 10) throw erro("Informe o telefone com DDD.")

  const tempoAtuacao = texto(b.tempoAtuacao)
  if (tempoAtuacao && !(FAIXAS_TEMPO_ATUACAO as readonly string[]).includes(tempoAtuacao)) throw erro("Tempo de atuação inválido.")

  const categorias = listaDeTextos(b.categorias)
  if (categorias.length === 0) throw erro("Escolha sua área de atuação.")

  return {
    nome: texto(b.nome),
    cidade: texto(b.cidade),
    estado,
    telefone,
    historia: texto(b.historia),
    trabalho: texto(b.trabalho),
    origemTrabalho: texto(b.origemTrabalho),
    gostaDeFazer: texto(b.gostaDeFazer),
    tempoAtuacao,
    categorias,
    tecnicas: listaDeTextos(b.tecnicas),
  }
}

export const minhaContaController = {
  // GET /minha-conta
  async conta(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.conta(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/pedidos — só os pedidos de quem está logado.
  async pedidos(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await pedidosService.listarDoUsuario(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/produtos (artesão)
  async produtos(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.produtos(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/resumo (artesão)
  async resumo(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.resumo(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // PATCH /minha-conta/produtos/:id (artesão) — corpo: { estoque? } e/ou { status? }
  async atualizarProduto(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = usuarioLogado(req)
      const b = ehObjeto(req.body) ? req.body : {}

      if (b.estoque === undefined && b.status === undefined) {
        throw new AppError(400, "VALIDATION", "Informe o estoque ou o status da peça.")
      }
      if (b.estoque !== undefined && (typeof b.estoque !== "number" || !Number.isInteger(b.estoque) || b.estoque < 0)) {
        throw new AppError(400, "VALIDATION", "O estoque precisa ser um número inteiro, zero ou maior.")
      }
      if (b.status !== undefined && b.status !== "publicado" && b.status !== "indisponivel") {
        throw new AppError(400, "VALIDATION", "Status inválido.")
      }

      const input: AtualizarEstoqueInput = {
        estoque: b.estoque as number | undefined,
        status: b.status as AtualizarEstoqueInput["status"],
      }
      const produto = await minhaContaService.atualizarProduto(usuario.id, req.params.id, input)
      return res.status(200).json(produto)
    } catch (err) {
      return next(err)
    }
  },

  // POST /minha-conta/produtos (artesão) — corpo: ProdutoInput
  async criarProduto(req: Request, res: Response, next: NextFunction) {
    try {
      const produto = await minhaContaService.criarProduto(usuarioLogado(req).id, lerProdutoInput(req.body))
      return res.status(201).json(produto)
    } catch (err) {
      return next(err)
    }
  },

  // PUT /minha-conta/produtos/:id (artesão) — corpo: ProdutoInput
  async editarProduto(req: Request, res: Response, next: NextFunction) {
    try {
      const produto = await minhaContaService.editarProduto(usuarioLogado(req).id, req.params.id, lerProdutoInput(req.body))
      return res.status(200).json(produto)
    } catch (err) {
      return next(err)
    }
  },

  // DELETE /minha-conta/produtos/:id (artesão)
  async excluirProduto(req: Request, res: Response, next: NextFunction) {
    try {
      await minhaContaService.excluirProduto(usuarioLogado(req).id, req.params.id)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  },

  // GET /minha-conta/perfil (artesão)
  async perfil(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await minhaContaService.perfil(usuarioLogado(req).id))
    } catch (err) {
      return next(err)
    }
  },

  // PUT /minha-conta/perfil (artesão) — corpo: PerfilArtesaoInput
  async atualizarPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      const perfil = await minhaContaService.atualizarPerfil(usuarioLogado(req).id, lerPerfilInput(req.body))
      return res.status(200).json(perfil)
    } catch (err) {
      return next(err)
    }
  },
}
