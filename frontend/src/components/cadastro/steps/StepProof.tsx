"use client"

import { Button, Fieldset, Input, Stack } from "@chakra-ui/react"
import { SelectField } from "@/components/common/SelectField"
import type { StepProps } from "@/types/artisan-registration"
import { StepForm } from "../StepForm"

const SIM_NAO = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
]

export function StepProof({ data, onChange, onNext }: StepProps) {
  function changeLink(index: number, value: string) {
    onChange("links", data.links.map((link, i) => (i === index ? value : link)))
  }

  return (
    <StepForm onSubmit={onNext}>
      <SelectField label="Possui registro e/ou certificações?" options={SIM_NAO}
        value={data.possuiRegistro}
        onChange={(value) => onChange("possuiRegistro", value)} />
      <SelectField label="Já participou de feiras ou exposições?" options={SIM_NAO}
        value={data.participouFeiras}
        onChange={(value) => onChange("participouFeiras", value)} />

      <Stack gap="3">
        <SelectField label="Pertence a alguma associação ou coletivo?" options={SIM_NAO}
          value={data.pertenceAssociacao}
          onChange={(value) => onChange("pertenceAssociacao", value)} />
        <Input
          placeholder="Caso sim, conte-nos qual"
          aria-label="Qual associação ou coletivo"
          disabled={data.pertenceAssociacao !== "sim"}
          value={data.qualAssociacao}
          onChange={(e) => onChange("qualAssociacao", e.target.value)}
        />
      </Stack>

      <Fieldset.Root>
        <Fieldset.Legend>Adicione 1 ou mais links que comprovem</Fieldset.Legend>
        <Fieldset.HelperText color="origem.textoSuave">
          Adicione links que ajudem a mostrar e comprovar seu trabalho. Pode ser seu Instagram,
          site, portfólio, página de uma associação ou cooperativa, participação em feiras,
          exposições ou outros espaços onde seu trabalho esteja apresentado. Não é obrigatório
          ter um site ou perfil profissional.
        </Fieldset.HelperText>

        <Stack gap="3">
          {data.links.map((link, index) => (
            <Input
              key={index}
              type="url"
              placeholder={`Link ${index + 1}`}
              aria-label={`Link ${index + 1}`}
              value={link}
              onChange={(e) => changeLink(index, e.target.value)}
            />
          ))}
          <Button variant="tracejado" type="button"
            onClick={() => onChange("links", [...data.links, ""])}>
            Adicionar mais um campo <span aria-hidden>+</span>
          </Button>
        </Stack>
      </Fieldset.Root>
    </StepForm>
  )
}
