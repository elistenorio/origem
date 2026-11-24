import { Router } from "express"
import { adminController } from "../controllers/admin.controller"
import { gestaoController } from "../controllers/gestao.controller"
import { authMiddleware } from "../../middleware/authMiddleware"
import { roleMiddleware } from "../../middleware/roleMiddleware"

export const adminRouter = Router()

// Tudo em /admin: login obrigatório (401) e perfil admin (403).
adminRouter.use(authMiddleware, roleMiddleware(["admin"]))

adminRouter.get("/painel", adminController.painel)
adminRouter.get("/acompanhamento", adminController.acompanhamento)
adminRouter.get("/pedidos", adminController.pedidos)
adminRouter.get("/curadoria", adminController.curadoria)
adminRouter.patch("/curadoria/:tipo/:id", adminController.decidirCuradoria)
adminRouter.get("/indicadores", adminController.indicadores)
adminRouter.get("/artesaos", gestaoController.artesaos)
adminRouter.patch("/artesaos/:id", gestaoController.alterarStatusArtesao)
adminRouter.get("/usuarios", gestaoController.clientes)
adminRouter.patch("/usuarios/:id", gestaoController.alterarStatusCliente)
adminRouter.get("/produtos", gestaoController.produtos)
