import { Router } from "express"
import { minhaContaController } from "../controllers/minhaConta.controller"
import { authMiddleware } from "../../middleware/authMiddleware"
import { roleMiddleware } from "../../middleware/roleMiddleware"

export const minhaContaRouter = Router()

// Tudo em /minha-conta exige login: o usuário vem do cookie, nunca de um id na URL.
minhaContaRouter.use(authMiddleware)

// Qualquer perfil
minhaContaRouter.get("/", minhaContaController.conta)
minhaContaRouter.get("/pedidos", minhaContaController.pedidos)

// Só artesão
const soArtesao = roleMiddleware(["artesao"])
minhaContaRouter.get("/produtos", soArtesao, minhaContaController.produtos)
minhaContaRouter.patch("/produtos/:id", soArtesao, minhaContaController.atualizarProduto)
minhaContaRouter.get("/resumo", soArtesao, minhaContaController.resumo)
