"use client"

import { useState } from "react"
import {
  initialRegistrationData,
  type ArtisanRegistrationData,
} from "@/types/artisan-registration"
import { RegisterStep } from "./RegisterStep"
import { SuccessDialog } from "./SuccessDialog"
import { StepIdentification } from "./steps/StepIdentification"
import { StepAbout } from "./steps/StepAbout"
// StepStory, StepProof e StepPhotos entram quando forem criadas

const steps = [
  { title: "Identificação", Component: StepIdentification },
  { title: "Conte sobre você", Component: StepAbout },
  // { title: "Conte sobre sua trajetória", Component: StepStory },
  // { title: "Compartilhe suas comprovações", Component: StepProof },
  // { title: "Mostre um pouco", Component: StepPhotos },
]

export function ArtisanRegistrationWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialRegistrationData)
  const [sent, setSent] = useState(false)

  function handleChange<K extends keyof ArtisanRegistrationData>(
    field: K,
    value: ArtisanRegistrationData[K],
  ) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function handleNext() {
    if (step < steps.length) {
      setStep(step + 1)
      window.scrollTo({ top: 0 }) // as etapas são longas: volta ao topo
    } else {
      console.log(data) // depois: enviar para a API
      setSent(true)
    }
  }

  const { title, Component } = steps[step - 1]

  return (
    <>
      <RegisterStep title={title} current={step} total={steps.length}>
        <Component data={data} onChange={handleChange} onNext={handleNext} />
      </RegisterStep>
      <SuccessDialog open={sent} />
    </>
  )
}