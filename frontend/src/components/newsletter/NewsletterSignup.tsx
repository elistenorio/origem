"use client"

import { useState, type FormEvent } from "react"
import { Alert, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react"
import { BiCheckCircle, BiEnvelope } from "react-icons/bi"
import { SectionCard } from "@/components/common/SectionCard"
import { FormField } from "@/components/common/FormField"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { useEnvio } from "@/hooks/useEnvio"
import { newsletterService } from "@/services/newsletter.service"
import { emailValido } from "@/utils/validation"
import type { AssinaturaNewsletter } from "@/types/newsletter"

type Erros = Partial<Record<"nome" | "email" | "aceite", string>>

// Formulário de assinatura da newsletter (POST /newsletter) e a confirmação depois de enviar.
export function NewsletterSignup() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [aceitou, setAceitou] = useState(false)
  const [erros, setErros] = useState<Erros>({})
  const [assinatura, setAssinatura] = useState<AssinaturaNewsletter>()
  const { enviando, erro, enviar } = useEnvio("Não foi possível fazer a assinatura. Tente de novo.")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Validação rápida na tela; o backend valida de novo.
    const novos: Erros = {}
    if (!nome.trim()) novos.nome = "Informe seu nome."
    if (!emailValido(email)) novos.email = "Informe um e-mail válido."
    if (!aceitou) novos.aceite = "Marque que aceita receber e-mails para assinar."
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    await enviar(async () => {
      setAssinatura(await newsletterService.assinar({ nome, email, aceitouTermos: aceitou }))
    })
  }

  if (assinatura) {
    return (
      <Stack align="center" textAlign="center" gap={3} bg="origem.fundo" borderWidth="1px" borderColor="origem.sucesso" borderRadius="xl" p={8} role="status">
        <Flex boxSize="56px" bg="origem.sucesso" color="white" borderRadius="full" alignItems="center" justifyContent="center">
          <BiCheckCircle size={28} />
        </Flex>
        <Heading as="h2" variant="destaque" fontSize="2xl">
          Inscrição confirmada!
        </Heading>
        <Text color="origem.texto">
          Obrigada, {assinatura.nome.split(" ")[0]}! A próxima edição da newsletter vai para <strong>{assinatura.email}</strong>.
        </Text>
      </Stack>
    )
  }

  return (
    <SectionCard title="Assine gratuitamente">
      <Text color="origem.textoSuave" mt={-2}>
        Preencha seus dados para receber a próxima edição.
      </Text>

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap={4}>
          <FormField label="Nome" placeholder="Como podemos te chamar?" value={nome} onChange={(e) => setNome(e.target.value)} error={erros.nome} />
          <FormField label="E-mail" type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} error={erros.email} />
          <AppCheckbox checked={aceitou} onCheckedChange={(e) => setAceitou(e.checked === true)}>
            Aceito receber e-mails e li a Política de Privacidade.
          </AppCheckbox>
          {erros.aceite && <Text color="origem.perigo">{erros.aceite}</Text>}
          {erro && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>{erro}</Alert.Title>
            </Alert.Root>
          )}
          <Button variant="origem" w="full" type="submit" loading={enviando}>
            <BiEnvelope /> Quero receber
          </Button>
          <Text textStyle="apoio">
            Seus dados são usados apenas para o envio da newsletter, conforme a LGPD. Você
            pode cancelar a inscrição a qualquer momento pelo link no fim de cada e-mail.
          </Text>
        </Stack>
      </form>
    </SectionCard>
  )
}
