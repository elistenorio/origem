import { api } from "./api"
import type { AssinaturaNewsletter, AssinaturaNewsletterInput } from "@/types/newsletter"

export const newsletterService = {
  /** POST /newsletter: assina a newsletter (assinar de novo com o mesmo e-mail só confirma de novo). */
  async assinar(input: AssinaturaNewsletterInput) {
    const response = await api.post<AssinaturaNewsletter>("/newsletter", input)
    return response.data
  },
}
