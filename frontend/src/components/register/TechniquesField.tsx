import { Fieldset, Grid, HStack, Input } from "@chakra-ui/react"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { labelStyle } from "@/theme/formStyles"

const TECNICAS = [
  "Modelagem manual", "Torneamento", "Bordado", "Tecelagem", "Entalhe", "Cestaria",
  "Xilogravura", "Pintura à Mão", "Ourivesaria", "Filigrana",
]
const OUTRA = "outra"

type TechniquesFieldProps = {
  selected: string[]
  onChange: (selected: string[]) => void
  other: string
  onOtherChange: (text: string) => void
}

export function TechniquesField({ selected, onChange, other, onOtherChange }: TechniquesFieldProps) {
  function toggle(tecnica: string, checked: boolean) {
    onChange(checked ? [...selected, tecnica] : selected.filter((t) => t !== tecnica))
  }

  const outraMarcada = selected.includes(OUTRA)

  return (
    <Fieldset.Root>
      <Fieldset.Legend {...labelStyle}>Técnicas que utiliza</Fieldset.Legend>
      <Fieldset.HelperText color="origem.texto" fontWeight="medium">
        Selecione todas as opções que se aplicam
      </Fieldset.HelperText>

      {/* preenche por coluna: 6 itens na primeira, o resto na segunda */}
      <Grid gridAutoFlow="column" gridTemplateRows="repeat(6, auto)"
            columnGap="8" rowGap="2" justifyContent="start">
        {TECNICAS.map((tecnica) => (
          <AppCheckbox
            key={tecnica}
            checked={selected.includes(tecnica)}
            onCheckedChange={(e) => toggle(tecnica, e.checked === true)}
          >
            {tecnica}
          </AppCheckbox>
        ))}

        <HStack gap="2">
          <AppCheckbox
            checked={outraMarcada}
            onCheckedChange={(e) => toggle(OUTRA, e.checked === true)}
          >
            Outra:
          </AppCheckbox>
          <Input
            variant="flushed"
            size="sm"
            w="32"
            borderColor="origem.texto"
            aria-label="Qual outra técnica"
            disabled={!outraMarcada}
            value={other}
            onChange={(e) => onOtherChange(e.target.value)}
          />
        </HStack>
      </Grid>
    </Fieldset.Root>
  )
}