import { Router } from "express"
import { produtosController } from "../controllers/produtos.controller"

export const produtosRouter = Router()

produtosRouter.get("/", produtosController.listar)
produtosRouter.get("/:id", produtosController.buscarPorId)
produtosRouter.get("/:id/relacionados", produtosController.relacionados)
