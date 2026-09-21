"use client"

import { Fieldset, SimpleGrid } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { labelStyle } from "@/theme/formStyles"
import type { StepProps } from "@/types/artisan-registration"
import { StepForm } from "../StepForm"
import { TechniquesField } from "../TechniquesField"

// EXEMPLOS: confirme as faixas e áreas reais com o time.
// Se as áreas forem as mesmas categorias da Home, reaproveite aquela lista.
const TEMPO_ATUACAO = [
  { value: "menos-1", label: "Menos de 1 ano" },
  { value: "1-3", label: "1 a 3 anos" },
  { value: "3-10", label: "3 a 10 anos" },
  { value: "mais-10", label: "Mais de 10 anos" },
]
const AREAS = [
  { value: "ceramica", label: "Cerâmica" },
  { value: "tecidos", label: "Tecidos e Bordados" },
  { value: "madeira", label: "Madeira" },
]

export function StepAbout({ data, onChange, onNext }: StepProps) {
  return (
    <StepForm onSubmit={onNext}>
      <FormField label="Nome artístico" placeholder="Nome"
        value={data.nomeArtistico}
        onChange={(e) => onChange("nomeArtistico", e.target.value)} />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        <SelectField label="Tempo de atuação" options={TEMPO_ATUACAO}
          value={data.tempoAtuacao}
          onChange={(value) => onChange("tempoAtuacao", value)} />
        <SelectField label="Área de atuação" options={AREAS}
          value={data.areaAtuacao}
          onChange={(value) => onChange("areaAtuacao", value)} />
      </SimpleGrid>

      <TechniquesField
        selected={data.tecnicas}
        onChange={(value) => onChange("tecnicas", value)}
        other={data.outraTecnica}
        onOtherChange={(value) => onChange("outraTecnica", value)}
      />

      <Fieldset.Root>
        <Fieldset.Legend {...labelStyle}>Local onde produz</Fieldset.Legend>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
          <FormField label="Cidade" value={data.cidade}
            onChange={(e) => onChange("cidade", e.target.value)} />
          <FormField label="Estado" value={data.estado}
            onChange={(e) => onChange("estado", e.target.value)} />
        </SimpleGrid>
      </Fieldset.Root>
    </StepForm>
  )
}