import { Router } from "express"
import { avaliacoesController } from "../controllers/avaliacoes.controller"
import { authMiddleware } from "../../middleware/authMiddleware"

export const avaliacoesRouter = Router()

avaliacoesRouter.post("/", authMiddleware, avaliacoesController.criar)
