"use client"

import { Field, Textarea } from "@chakra-ui/react"
import type { StepProps } from "@/types/artisan-registration"
import { StepForm } from "../StepForm"

type CampoTexto = "historia" | "trabalho" | "origemTrabalho" | "gostaDeFazer"

const PERGUNTAS: {
  campo: CampoTexto
  inicio: string // parte do rótulo em peso normal
  destaque: string // parte do rótulo em negrito
  placeholder: string
}[] = [
  {
    campo: "historia",
    inicio: "Conte um pouco ",
    destaque: "sobre você",
    placeholder:
      "Conte um pouco da sua história. Você pode falar sobre onde nasceu e cresceu, como começou a trabalhar com artesanato, há quanto tempo atua na área e o que fez você escolher esse caminho. Não precisa escrever de forma formal: queremos conhecer você e sua trajetória.",
  },
  {
    campo: "trabalho",
    inicio: "Conte um pouco ",
    destaque: "sobre o seu trabalho",
    placeholder:
      "Fale sobre o que você faz e como trabalha. Conte quais peças produz, quais materiais e técnicas utiliza e como costuma ser seu processo de criação. Você também pode falar sobre o que diferencia o seu trabalho ou o que considera importante manter nele.",
  },
  {
    campo: "origemTrabalho",
    inicio: "Conte um pouco ",
    destaque: "sobre de onde vem o seu trabalho?",
    placeholder:
      "Conte sobre as pessoas, lugares e conhecimentos que fazem parte da sua trajetória. Você pode falar sobre quem ensinou você, onde aprendeu seu ofício, se aprendeu com familiares ou outros artesãos e quais tradições ou conhecimentos procura manter no seu trabalho.",
  },
  {
    campo: "gostaDeFazer",
    inicio: "Conte um pouco ",
    destaque: "sobre o que você gosta de fazer?",
    placeholder:
      "Fale sobre as peças, técnicas ou etapas do trabalho que você mais gosta de fazer. Pode contar o que dá mais prazer no seu processo, quais tipos de peça você prefere produzir ou o que mais gosta de explorar com os materiais que utiliza.",
  },
]

export function StepStory({ data, onChange, onNext }: StepProps) {
  return (
    <StepForm onSubmit={onNext}>
      {PERGUNTAS.map(({ campo, inicio, destaque, placeholder }) => (
        <Field.Root key={campo}>
          <Field.Label>
            <span style={{ fontWeight: "normal" }}>{inicio}</span>
            {destaque}
          </Field.Label>
          <Textarea
            minH="180px"
            resize="none"
            p="4"
            placeholder={placeholder}
            value={data[campo]}
            onChange={(e) => onChange(campo, e.target.value)}
          />
        </Field.Root>
      ))}
    </StepForm>
  )
}
