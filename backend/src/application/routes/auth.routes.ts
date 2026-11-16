import { Router } from "express"
import { authController } from "../controllers/auth.controller"
import { authMiddleware } from "../../middleware/authMiddleware"

export const authRouter = Router()

authRouter.post("/login", authController.login)
authRouter.post("/logout", authController.logout)
authRouter.get("/me", authMiddleware, authController.me)
