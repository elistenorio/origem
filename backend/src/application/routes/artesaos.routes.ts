import { Router } from "express"
import { artesaosController } from "../controllers/artesaos.controller"

export const artesaosRouter = Router()

artesaosRouter.get("/", artesaosController.listar)
artesaosRouter.get("/:id", artesaosController.buscarPorId)
