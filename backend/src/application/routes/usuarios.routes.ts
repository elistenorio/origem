import { Router } from "express"
import { usuariosController } from "../controllers/usuarios.controller"

export const usuariosRouter = Router()

usuariosRouter.post("/", usuariosController.cadastrar)
