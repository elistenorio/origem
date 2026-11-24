import type { NextFunction, Request, Response } from "express"
import { usuariosService } from "../../infrastructure/services/usuarios.service"
import { AppError } from "../../shared/AppError"
import { FAIXAS_TEMPO_ATUACAO, type CadastroArtesaoInput } from "../../shared/types/artesao"
import { ehObjeto, validarSenha, emailValido, texto, textoPreenchido } from "../../shared/validacao"

const MAX_LINKS = 3
const erro = (mensagem: string) => new AppError(400, "VALIDATION", mensagem)

function listaDeTextos(valor: unknown): string[] {
  return Array.isArray(valor) ? valor.map(texto).filter(Boolean) : []
}

function lerCadastroArtesao(body: unknown): CadastroArtesaoInput {
  const b = ehObjeto(body) ? body : {}

  if (b.aceitouTermos !== true) throw erro("Aceite os termos de uso para continuar.")
  if (!textoPreenchido(b.nome)) throw erro("Informe seu nome completo.")
  if (!emailValido(b.email)) throw erro("Informe um e-mail válido.")
  validarSenha(b.senha)

  const telefone = texto(b.telefone)
  if (telefone && telefone.replace(/\D/g, "").length < 10) throw erro("Informe o telefone com DDD.")

  const tempoAtuacao = texto(b.tempoAtuacao)
  if (tempoAtuacao && !(FAIXAS_TEMPO_ATUACAO as readonly string[]).includes(tempoAtuacao)) throw erro("Tempo de atuação inválido.")

  if (!textoPreenchido(b.oficio)) throw erro("Informe o seu ofício (ex.: ceramista, bordadeira).")
  if (!textoPreenchido(b.categoria)) throw erro("Escolha sua área de atuação.")
  if (!textoPreenchido(b.cidade)) throw erro("Informe sua cidade.")
  const estado = texto(b.estado).toUpperCase()
  if (!/^[A-Z]{2}$/.test(estado)) throw erro("Informe o estado com 2 letras (ex.: PE).")
  if (!textoPreenchido(b.regiao)) throw erro("Escolha a sua região.")
  if (!textoPreenchido(b.historia)) throw erro("Conte um pouco da sua história.")

  const c = ehObjeto(b.comprovacoes) ? b.comprovacoes : {}
  const links = listaDeTextos(c.links)
  if (links.length > MAX_LINKS) throw erro(`Envie no máximo ${MAX_LINKS} links.`)
  if (links.some((link) => !/^https?:\/\/\S+$/i.test(link))) throw erro("Use links completos, começando com http:// ou https://.")
  const pertenceAssociacao = c.pertenceAssociacao === true

  return {
    nome: texto(b.nome),
    email: texto(b.email),
    senha: b.senha,
    telefone,
    nomeArtistico: texto(b.nomeArtistico),
    oficio: texto(b.oficio),
    tempoAtuacao,
    categoria: texto(b.categoria),
    tecnicas: listaDeTextos(b.tecnicas),
    cidade: texto(b.cidade),
    estado,
    regiao: texto(b.regiao),
    historia: texto(b.historia),
    trabalho: texto(b.trabalho),
    origemTrabalho: texto(b.origemTrabalho),
    gostaDeFazer: texto(b.gostaDeFazer),
    comprovacoes: {
      possuiRegistro: c.possuiRegistro === true,
      participouFeiras: c.participouFeiras === true,
      pertenceAssociacao,
      associacao: pertenceAssociacao ? texto(c.associacao) : "",
      links,
    },
  }
}

export const usuariosController = {
  // POST /usuarios — cadastro de comprador. Corpo: { nome, email, senha }
  async cadastrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body ?? {}

      if (!textoPreenchido(nome)) {
        throw new AppError(400, "VALIDATION", "Informe o nome.")
      }
      if (!emailValido(email)) {
        throw new AppError(400, "VALIDATION", "Informe um e-mail válido.")
      }
      validarSenha(senha)

      const usuario = await usuariosService.cadastrarComprador({ nome, email, senha })
      return res.status(201).json(usuario)
    } catch (err) {
      return next(err)
    }
  },

  async cadastrarArtesao(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await usuariosService.cadastrarArtesao(lerCadastroArtesao(req.body))
      return res.status(201).json(usuario)
    } catch (err) {
      return next(err)
    }
  },
}
