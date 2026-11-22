import type { NextFunction, Request, Response } from "express"
import type { FormaPagamento } from "@prisma/client"
import { pedidosService } from "../../infrastructure/services/pedidos.service"
import { AppError } from "../../shared/AppError"
import type { ModalidadeFrete } from "../../shared/types/frete"
import { STATUS_AVANCO, type Comprador, type CriarPedidoInput, type Endereco, type StatusAvanco } from "../../shared/types/pedido"
import { ehObjeto, emailValido, texto } from "../../shared/validacao"

const MODALIDADES: ModalidadeFrete[] = ["pac", "sedex"]
const PAGAMENTOS: FormaPagamento[] = ["cartao", "pix", "boleto"]
const MAX_PARCELAS = 12

const erro = (message: string) => new AppError(400, "VALIDATION", message)

// Valida o corpo de POST /pedidos e monta o input do service (só com os campos conhecidos).
function lerPedido(body: unknown): CriarPedidoInput {
  const b = ehObjeto(body) ? body : {}

  if (!Array.isArray(b.itens) || b.itens.length === 0) throw erro("O pedido precisa ter pelo menos uma peça.")
  const itens = b.itens.map((item: unknown) => {
    const i = ehObjeto(item) ? item : {}
    const produtoId = texto(i.produtoId)
    const quantidade = i.quantidade
    if (!produtoId || typeof quantidade !== "number" || !Number.isInteger(quantidade) || quantidade < 1) {
      throw erro("Cada peça precisa de um produtoId e de uma quantidade inteira de pelo menos 1.")
    }
    return { produtoId, quantidade }
  })

  const c = ehObjeto(b.comprador) ? b.comprador : {}
  const comprador: Comprador = { nome: texto(c.nome), cpf: texto(c.cpf), email: texto(c.email).toLowerCase(), telefone: texto(c.telefone) }
  if (!comprador.nome || !comprador.email) throw erro("Informe nome e e-mail do comprador.")
  if (!emailValido(comprador.email)) throw erro("Informe um e-mail válido.")

  const e = ehObjeto(b.endereco) ? b.endereco : {}
  const endereco: Endereco = {
    cep: texto(e.cep),
    rua: texto(e.rua),
    numero: texto(e.numero),
    complemento: texto(e.complemento),
    bairro: texto(e.bairro),
    cidade: texto(e.cidade),
    estado: texto(e.estado),
  }
  if (!endereco.cep) throw erro("Informe o endereço de entrega.")
  if (endereco.cep.replace(/\D/g, "").length !== 8) throw erro("Informe um CEP válido com 8 números.")

  // Do frete, o backend só aproveita a modalidade escolhida; valor e prazo são recalculados pelo CEP.
  const modalidadeFrete = ehObjeto(b.frete) ? (texto(b.frete.modalidade) as ModalidadeFrete) : undefined
  if (!modalidadeFrete || !MODALIDADES.includes(modalidadeFrete)) throw erro("Escolha uma opção de frete.")

  const pagamento = texto(b.pagamento) as FormaPagamento
  if (!PAGAMENTOS.includes(pagamento)) throw erro("Escolha a forma de pagamento.")

  // Parcelas: padrão 1; entre 1 e 12.
  const parcelas = b.parcelas === undefined ? 1 : b.parcelas
  if (typeof parcelas !== "number" || !Number.isInteger(parcelas) || parcelas < 1 || parcelas > MAX_PARCELAS) {
    throw erro(`O número de parcelas precisa ser de 1 a ${MAX_PARCELAS}.`)
  }

  return { itens, comprador, endereco, modalidadeFrete, pagamento, parcelas }
}

export const pedidosController = {
  // POST /pedidos — aberto a visitantes; se houver login, o pedido fica ligado ao usuário.
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const pedido = await pedidosService.criar(lerPedido(req.body), req.user?.id)
      return res.status(201).json(pedido)
    } catch (err) {
      return next(err)
    }
  },

  // PATCH /pedidos/:id — corpo: { status: "cancelado", motivo, observacao? } ou { status: "emSeparacao" | "enviado" | "entregue", codigoRastreio? }
  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Faça login para continuar.")
      const b = ehObjeto(req.body) ? req.body : {}

      if (b.status === "cancelado") {
        const motivo = texto(b.motivo)
        if (!motivo) throw erro("Escolha o motivo do cancelamento.")
        return res.status(200).json(await pedidosService.cancelar(req.params.id, motivo, req.user))
      }

      if (!STATUS_AVANCO.includes(b.status as StatusAvanco)) throw erro("Status inválido.")
      const status = b.status as StatusAvanco
      const codigoRastreio = status === "enviado" ? texto(b.codigoRastreio) : undefined
      if (status === "enviado" && !codigoRastreio) throw erro("Informe o código de rastreio.")

      const pedido = await pedidosService.avancar(req.params.id, { status, codigoRastreio }, req.user)
      return res.status(200).json(pedido)
    } catch (err) {
      return next(err)
    }
  },
}
