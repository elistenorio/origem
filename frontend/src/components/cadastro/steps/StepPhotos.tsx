"use client"

import { Stack, Text } from "@chakra-ui/react"
import { FileField } from "@/components/common/FileField"
import type { StepProps } from "@/types/artisan-registration"
import { StepForm } from "../StepForm"

type CampoFoto = "fotoPerfil" | "fotosPecas" | "fotosProcessos"

const SECOES: {
  campo: CampoFoto
  titulo: string
  destaque: string // primeira frase, em negrito
  texto: string
  multiple: boolean
}[] = [
  {
    campo: "fotoPerfil",
    titulo: "Foto de perfil",
    destaque: "Escolha uma foto que mostre você e um pouco do seu trabalho.",
    texto:
      "Pode ser um retrato ou uma foto sua durante o processo de produção. Prefira imagens nítidas, bem iluminadas e em que seja possível reconhecer você.",
    multiple: false,
  },
  {
    campo: "fotosPecas",
    titulo: "Fotos das peças",
    destaque: "Adicione fotos de peças produzidas por você.",
    texto:
      "Escolha imagens que mostrem bem seus produtos, de preferência com boa iluminação e diferentes ângulos. Você pode adicionar fotos de peças individuais ou de um conjunto.",
    multiple: true,
  },
  {
    campo: "fotosProcessos",
    titulo: "Fotos dos seus processos",
    destaque: "Mostre um pouco de como seu trabalho é feito.",
    texto:
      "Você pode fotografar etapas da produção, suas ferramentas, materiais, seu espaço de trabalho ou você trabalhando. Não é necessário que as fotos sejam profissionais, queremos conhecer o seu fazer.",
    multiple: true,
  },
]

export function StepPhotos({ data, onChange, onNext }: StepProps) {
  return (
    <StepForm onSubmit={onNext}>
      {SECOES.map(({ campo, titulo, destaque, texto, multiple }) => (
        <Stack key={campo} gap="2">
          <Text as="h2" fontWeight="bold" textTransform="uppercase" color="origem.texto">
            {titulo}
          </Text>
          <Text color="origem.textoSuave">
            <Text as="span" fontWeight="bold">
              {destaque}
            </Text>{" "}
            {texto}
          </Text>
          <FileField
            label={titulo}
            multiple={multiple}
            value={data[campo]}
            onChange={(files) => onChange(campo, files)}
          />
        </Stack>
      ))}
    </StepForm>
  )
}
