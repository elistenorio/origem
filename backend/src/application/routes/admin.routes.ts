import { Router } from "express"
import { adminController } from "../controllers/admin.controller"
import { authMiddleware } from "../../middleware/authMiddleware"
import { roleMiddleware } from "../../middleware/roleMiddleware"

export const adminRouter = Router()

// Tudo em /admin: login obrigatório (401) e perfil admin (403).
adminRouter.use(authMiddleware, roleMiddleware(["admin"]))

adminRouter.get("/painel", adminController.painel)
