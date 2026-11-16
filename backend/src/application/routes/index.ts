import { Router } from "express"
import { artesaosRouter } from "./artesaos.routes"
import { authRouter } from "./auth.routes"
import { filtrosRouter } from "./filtros.routes"
import { freteRouter } from "./frete.routes"
import { produtosRouter } from "./produtos.routes"
import { usuariosRouter } from "./usuarios.routes"

// Todas as rotas da API (montadas em /api no server.ts), com os mesmos caminhos de docs/api.md.
export const router = Router()

// Autenticação e cadastro
router.use("/auth", authRouter)
router.use("/usuarios", usuariosRouter)

// Vitrine (públicas)
router.use("/produtos", produtosRouter)
router.use("/filtros", filtrosRouter)
router.use("/artesaos", artesaosRouter)
router.use("/frete", freteRouter)
