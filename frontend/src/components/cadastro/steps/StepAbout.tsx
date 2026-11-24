"use client"

import { Fieldset, SimpleGrid } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { TEMPO_ATUACAO } from "@/constants/artesao"
import { CATEGORIAS } from "@/constants/categorias"
import { ESTADOS, REGIOES } from "@/constants/regioes"
import type { StepProps } from "@/types/artisan-registration"
import { StepForm } from "../StepForm"
import { TechniquesField } from "../TechniquesField"

const selecione = (opcoes: { value: string; label: string }[]) => [{ value: "", label: "Selecione" }, ...opcoes]

export function StepAbout({ data, onChange, onNext }: StepProps) {
  return (
    <StepForm onSubmit={onNext} disabled={!data.areaAtuacao || !data.regiao}>
      <FormField label="Nome artístico" placeholder="Nome" hint="Como você quer aparecer no Origem. Se ficar vazio, usamos seu nome."
        value={data.nomeArtistico}
        onChange={(e) => onChange("nomeArtistico", e.target.value)} />
      <FormField label="Ofício" placeholder="Ex.: ceramista, bordadeira, xilogravurista" required
        value={data.oficio}
        onChange={(e) => onChange("oficio", e.target.value)} />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        <SelectField label="Tempo de atuação" hint="Há quanto tempo você trabalha com artesanato." options={TEMPO_ATUACAO}
          value={data.tempoAtuacao}
          onChange={(value) => onChange("tempoAtuacao", value)} />
        <SelectField label="Área de atuação" hint="O tipo de peça que você mais faz." options={selecione(CATEGORIAS)}
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
        <Fieldset.Legend>Local onde produz</Fieldset.Legend>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
          <FormField label="Cidade" value={data.cidade} required
            onChange={(e) => onChange("cidade", e.target.value)} />
          <SelectField label="Estado" options={ESTADOS} value={data.estado}
            onChange={(value) => onChange("estado", value)} />
        </SimpleGrid>
        <SelectField label="Região" options={selecione(REGIOES)} value={data.regiao}
          onChange={(value) => onChange("regiao", value)} />
      </Fieldset.Root>
    </StepForm>
  )
}