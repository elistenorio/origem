import type { NextFunction, Request, Response } from "express"
import { contaService } from "../../infrastructure/services/conta.service"
import { AppError } from "../../shared/AppError"
import { NOME_COOKIE_TOKEN, opcoesCookieToken } from "../../shared/cookie"
import type { Endereco } from "../../shared/types/pedido"
import { BANDEIRAS_CARTAO, type CartaoInput } from "../../shared/types/usuario"
import { SENHA_TAMANHO_MINIMO, ehObjeto, texto, textoPreenchido } from "../../shared/validacao"

const erro = (mensagem: string) => new AppError(400, "VALIDATION", mensagem)
const digitos = (valor: string) => valor.replace(/\D/g, "")

function usuarioLogado(req: Request) {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")
  return req.user
}

function corpo(req: Request) {
  return ehObjeto(req.body) ? req.body : {}
}

function lerEndereco(b: Record<string, unknown>): Endereco {
  const endereco: Endereco = {
    cep: digitos(texto(b.cep)),
    rua: texto(b.rua),
    numero: texto(b.numero),
    complemento: texto(b.complemento),
    bairro: texto(b.bairro),
    cidade: texto(b.cidade),
    estado: texto(b.estado).toUpperCase(),
  }
  if (endereco.cep.length !== 8) throw erro("Informe um CEP válido com 8 números.")
  if (!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade) throw erro("Preencha rua, número, bairro e cidade.")
  if (!/^[A-Z]{2}$/.test(endereco.estado)) throw erro("Informe o estado com 2 letras (ex.: PE).")
  return endereco
}

export const contaController = {
  async atualizarDados(req: Request, res: Response, next: NextFunction) {
    try {
      const b = corpo(req)
      if (!textoPreenchido(b.nome)) throw erro("Informe o nome.")
      const telefone = texto(b.telefone)
      if (telefone && digitos(telefone).length < 10) throw erro("Informe o telefone com DDD.")
      let cpf: string | undefined
      if (b.cpf !== undefined) {
        cpf = digitos(texto(b.cpf))
        if (cpf && cpf.length !== 11) throw erro("Informe o CPF com 11 números.")
      }
      return res.status(200).json(await contaService.atualizarDados(usuarioLogado(req).id, { nome: texto(b.nome), telefone, cpf }))
    } catch (err) {
      return next(err)
    }
  },

  async salvarEndereco(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(await contaService.salvarEndereco(usuarioLogado(req).id, lerEndereco(corpo(req))))
    } catch (err) {
      return next(err)
    }
  },

  async alterarSenha(req: Request, res: Response, next: NextFunction) {
    try {
      const b = corpo(req)
      if (typeof b.senhaAtual !== "string" || !b.senhaAtual) throw erro("Informe a senha atual.")
      if (typeof b.novaSenha !== "string" || b.novaSenha.length < SENHA_TAMANHO_MINIMO) {
        throw erro(`A nova senha precisa ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`)
      }
      await contaService.alterarSenha(usuarioLogado(req).id, b.senhaAtual, b.novaSenha)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  },

  async salvarPreferencias(req: Request, res: Response, next: NextFunction) {
    try {
      const b = corpo(req)
      const campos = ["newsletter", "novidadesArtesaos", "whatsapp"] as const
      if (campos.some((c) => typeof b[c] !== "boolean")) throw erro("Envie newsletter, novidadesArtesaos e whatsapp como true ou false.")
      const preferencias = { newsletter: b.newsletter === true, novidadesArtesaos: b.novidadesArtesaos === true, whatsapp: b.whatsapp === true }
      return res.status(200).json(await contaService.salvarPreferencias(usuarioLogado(req).id, preferencias))
    } catch (err) {
      return next(err)
    }
  },

  async adicionarCartao(req: Request, res: Response, next: NextFunction) {
    try {
      const b = corpo(req)
      const bandeira = texto(b.bandeira) as CartaoInput["bandeira"]
      if (!BANDEIRAS_CARTAO.includes(bandeira)) throw erro("Escolha a bandeira do cartão.")
      const ultimosDigitos = texto(b.ultimosDigitos)
      if (!/^\d{4}$/.test(ultimosDigitos)) throw erro("Informe só os 4 últimos números do cartão.")
      return res.status(201).json(await contaService.adicionarCartao(usuarioLogado(req).id, { bandeira, ultimosDigitos }))
    } catch (err) {
      return next(err)
    }
  },

  async removerCartao(req: Request, res: Response, next: NextFunction) {
    try {
      const indice = Number(req.params.indice)
      if (!Number.isInteger(indice)) throw erro("Forma de pagamento inválida.")
      return res.status(200).json(await contaService.removerCartao(usuarioLogado(req).id, indice))
    } catch (err) {
      return next(err)
    }
  },

  async excluir(req: Request, res: Response, next: NextFunction) {
    try {
      const b = corpo(req)
      if (typeof b.senha !== "string" || !b.senha) throw erro("Informe sua senha para confirmar.")
      await contaService.excluirConta(usuarioLogado(req).id, b.senha)
      res.clearCookie(NOME_COOKIE_TOKEN, opcoesCookieToken)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  },
}
