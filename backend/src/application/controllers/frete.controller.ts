import type { NextFunction, Request, Response } from "express"
import { freteService } from "../../infrastructure/services/frete.service"
import { AppError } from "../../shared/AppError"

export const freteController = {
  // GET /frete?cep=50030-170 — aceita o CEP com ou sem hífen.
  calcular(req: Request, res: Response, next: NextFunction) {
    try {
      const cep = (typeof req.query.cep === "string" ? req.query.cep : "").replace(/\D/g, "")
      if (cep.length !== 8) {
        throw new AppError(400, "VALIDATION", "Informe um CEP válido com 8 números.")
      }
      return res.status(200).json(freteService.calcular(cep))
    } catch (err) {
      return next(err)
    }
  },
}
