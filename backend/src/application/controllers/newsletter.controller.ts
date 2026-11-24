import type { NextFunction, Request, Response } from "express"
import { newsletterService } from "../../infrastructure/services/newsletter.service"
import { AppError } from "../../shared/AppError"
import { ehObjeto, emailValido, texto, textoPreenchido } from "../../shared/validacao"

const erro = (mensagem: string) => new AppError(400, "VALIDATION", mensagem)

export const newsletterController = {
  // POST /newsletter (pública) — corpo: { nome, email, aceitouTermos }
  async assinar(req: Request, res: Response, next: NextFunction) {
    try {
      const b = ehObjeto(req.body) ? req.body : {}
      if (!textoPreenchido(b.nome)) throw erro("Informe seu nome.")
      if (!emailValido(b.email)) throw erro("Informe um e-mail válido.")
      if (b.aceitouTermos !== true) throw erro("Marque que aceita receber e-mails para assinar.")

      const assinatura = await newsletterService.assinar(texto(b.nome), texto(b.email))
      return res.status(201).json(assinatura)
    } catch (err) {
      return next(err)
    }
  },
}
