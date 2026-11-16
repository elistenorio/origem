import type { PerfilUsuario } from "@prisma/client"

// Acrescenta req.user ao Request do Express. Quem preenche é o authMiddleware, a partir do JWT.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        perfil: PerfilUsuario
      }
    }
  }
}

export {}
