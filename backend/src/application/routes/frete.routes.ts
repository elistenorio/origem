import { Router } from "express"
import { freteController } from "../controllers/frete.controller"

export const freteRouter = Router()

freteRouter.get("/", freteController.calcular)
