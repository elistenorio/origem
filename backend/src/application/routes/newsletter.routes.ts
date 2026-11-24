import { Router } from "express"
import { newsletterController } from "../controllers/newsletter.controller"

export const newsletterRouter = Router()

// Pública: qualquer visitante pode assinar.
newsletterRouter.post("/", newsletterController.assinar)
