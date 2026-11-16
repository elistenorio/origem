import { Router } from "express"
import { filtrosController } from "../controllers/filtros.controller"

export const filtrosRouter = Router()

filtrosRouter.get("/", filtrosController.listar)
