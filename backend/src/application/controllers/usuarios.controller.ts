import type { NextFunction, Request, Response } from "express"
import { usuariosService } from "../../infrastructure/services/usuarios.service"
import { AppError } from "../../shared/AppError"
import { SENHA_TAMANHO_MINIMO, emailValido, textoPreenchido } from "../../shared/validacao"

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
      if (typeof senha !== "string" || senha.length < SENHA_TAMANHO_MINIMO) {
        throw new AppError(400, "VALIDATION", `A senha precisa ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`)
      }

      const usuario = await usuariosService.cadastrarComprador({ nome, email, senha })
      return res.status(201).json(usuario)
    } catch (err) {
      return next(err)
    }
  },
}
