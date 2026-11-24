import { normalizarEmail } from "../../shared/validacao"
import type { AssinaturaNewsletter } from "../../shared/types/newsletter"
import { newsletterRepository } from "../repositories/newsletter.repository"

export const newsletterService = {
  /**
   * POST /newsletter: salva a assinatura. Assinar de novo com o mesmo e-mail não é erro:
   * a pessoa só recebe a confirmação de novo (e o nome é atualizado).
   */
  async assinar(nome: string, email: string): Promise<AssinaturaNewsletter> {
    return newsletterRepository.salvar({ nome: nome.trim(), email: normalizarEmail(email) })
  },
}
