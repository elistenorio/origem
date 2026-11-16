import { Router } from "express"
import { pedidosController } from "../controllers/pedidos.controller"
import { authMiddleware, optionalAuthMiddleware } from "../../middleware/authMiddleware"

export const pedidosRouter = Router()

// Visitante pode comprar; logado, o pedido fica ligado à conta.
pedidosRouter.post("/", optionalAuthMiddleware, pedidosController.criar)
// Cancelar exige login (dono do pedido ou admin, conferido no service).
pedidosRouter.patch("/:id", authMiddleware, pedidosController.atualizar)
