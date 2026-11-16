import { PrismaClient } from "@prisma/client"

// Uma única instância para toda a aplicação (cada PrismaClient abre o seu próprio pool de conexões).
export const prisma = new PrismaClient({
  log: ["warn", "error"],
})
