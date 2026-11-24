import { prisma } from "../prisma/client"
import type { AssinaturaNewsletter } from "../../shared/types/newsletter"

export const newsletterRepository = {
  /** Cria a assinatura ou, se o e-mail já assina, só atualiza o nome. */
  async salvar(dados: AssinaturaNewsletter): Promise<AssinaturaNewsletter> {
    return prisma.assinanteNewsletter.upsert({
      where: { email: dados.email },
      create: dados,
      update: { nome: dados.nome },
      select: { nome: true, email: true },
    })
  },
}
