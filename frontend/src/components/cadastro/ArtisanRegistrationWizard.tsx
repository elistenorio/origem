"use client"

import { useState } from "react"
import { Alert, Box } from "@chakra-ui/react"
import {
  initialRegistrationData,
  type ArtisanRegistrationData,
} from "@/types/artisan-registration"
import { ApiError } from "@/services/api"
import { authService } from "@/services/auth.service"
import { cadastroParaInput } from "@/utils/cadastroArtesao"
import { RegisterStep } from "./RegisterStep"
import { SuccessDialog } from "./SuccessDialog"
import { StepIdentification } from "./steps/StepIdentification"
import { StepAbout } from "./steps/StepAbout"
import { StepStory } from "./steps/StepStory"
import { StepProof } from "./steps/StepProof"
import { StepPhotos } from "./steps/StepPhotos"

const steps = [
  { title: "Identificação", Component: StepIdentification },
  { title: "Conte sobre você", Component: StepAbout },
  { title: "Conte sobre sua trajetória", Component: StepStory },
  { title: "Compartilhe suas comprovações", Component: StepProof },
  { title: "Mostre um pouco", Component: StepPhotos },
]

export function ArtisanRegistrationWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialRegistrationData)
  const [sent, setSent] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string>()

  function handleChange<K extends keyof ArtisanRegistrationData>(
    field: K,
    value: ArtisanRegistrationData[K],
  ) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function irPara(etapa: number) {
    setStep(etapa)
    window.scrollTo({ top: 0 }) // as etapas são longas: volta ao topo
  }

  async function enviar() {
    setEnviando(true)
    setErro(undefined)
    try {
      await authService.cadastrarArtesao(cadastroParaInput(data))
      setSent(true)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível enviar o cadastro. Tente de novo.")
      if (e instanceof ApiError && e.code === "CONFLICT") irPara(1)
    } finally {
      setEnviando(false)
    }
  }

  function handleNext() {
    setErro(undefined)
    if (step < steps.length) irPara(step + 1)
    else enviar()
  }

  const { title, Component } = steps[step - 1]

  return (
    <>
      <RegisterStep title={title} current={step} total={steps.length}>
        {erro && (
          <Box mb="6">
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>{erro}</Alert.Title>
            </Alert.Root>
          </Box>
        )}
        <Component data={data} onChange={handleChange} onNext={handleNext} enviando={enviando} />
      </RegisterStep>
      <SuccessDialog open={sent} />
    </>
  )
}
