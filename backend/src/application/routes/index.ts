import { Router } from "express"
import { authRouter } from "./auth.routes"
import { usuariosRouter } from "./usuarios.routes"

// Todas as rotas da API (montadas em /api no server.ts), com os mesmos caminhos de docs/api.md.
export const router = Router()

router.use("/auth", authRouter)
router.use("/usuarios", usuariosRouter)
