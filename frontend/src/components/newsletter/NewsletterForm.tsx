"use client"

import { useState } from "react"
import { Alert, Button, Stack, Text } from "@chakra-ui/react"
import { BiCheckCircle, BiEnvelope } from "react-icons/bi"
import { Panel } from "@/components/common/Panel"
import { FormField } from "@/components/common/FormField"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import type { InscricaoNewsletter, InscricaoNewsletterInput } from "@/dados-exemplo/tipos"

// Formulário de inscrição na newsletter e confirmação. Por enquanto a inscrição é só visual (sem API).
export function NewsletterForm() {
  const [dados, setDados] = useState<InscricaoNewsletterInput>({ nome: "", email: "", consentimento: false })
  const [inscricao, setInscricao] = useState<InscricaoNewsletter>()
  const [erro, setErro] = useState<string>()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dados.nome.trim()) return setErro("Informe seu nome.")
    if (!dados.email.includes("@")) return setErro("Informe um e-mail válido.")
    if (!dados.consentimento) return setErro("Para assinar, aceite receber os e-mails do Origem.")
    setErro(undefined)
    setInscricao({ nome: dados.nome, email: dados.email, inscritoEm: new Date().toISOString() })
  }

  if (inscricao) {
    return (
      <Panel title="Inscrição confirmada!">
        <Stack gap="3" align="flex-start">
          <Text fontSize="4xl" color="origem.sucesso"><BiCheckCircle /></Text>
          <Text>
            Tudo certo, {inscricao.nome.split(" ")[0]}! Enviamos um e-mail para <strong>{inscricao.email}</strong>. A próxima edição chega em breve.
          </Text>
        </Stack>
      </Panel>
    )
  }

  return (
    <Panel title="Assine gratuitamente" description="Preencha seus dados para receber a próxima edição.">
      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="4">
          <FormField label="Nome" placeholder="Como podemos te chamar?" value={dados.nome} onChange={(e) => setDados((d) => ({ ...d, nome: e.target.value }))} autoComplete="given-name" />
          <FormField label="E-mail" type="email" placeholder="email@exemplo.com" value={dados.email} onChange={(e) => setDados((d) => ({ ...d, email: e.target.value }))} autoComplete="email" />
          <AppCheckbox checked={dados.consentimento} onCheckedChange={(e) => setDados((d) => ({ ...d, consentimento: !!e.checked }))}>
            Aceito receber e-mails do Origem e li a Política de Privacidade.
          </AppCheckbox>
          {erro && <Alert.Root status="error"><Alert.Indicator /><Alert.Title>{erro}</Alert.Title></Alert.Root>}
          <Button type="submit" variant="origem">
            <BiEnvelope /> Quero receber
          </Button>
          <Text textStyle="apoio">Seus dados são usados apenas para o envio da newsletter, conforme a LGPD. Cancele quando quiser pelo link no fim de cada e-mail.</Text>
        </Stack>
      </form>
    </Panel>
  )
}
