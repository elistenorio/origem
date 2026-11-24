// Contrato da newsletter: o mesmo formato de frontend/src/types/newsletter.ts.

// POST /newsletter: o que a tela envia.
export type AssinaturaNewsletterInput = {
  nome: string
  email: string
  aceitouTermos: boolean
}

// Resposta de POST /newsletter: o nome e o e-mail como ficaram salvos.
export type AssinaturaNewsletter = {
  nome: string
  email: string
}
