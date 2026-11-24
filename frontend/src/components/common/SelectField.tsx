import { Field, NativeSelect } from "@chakra-ui/react"

type Option = { value: string; label: string }

type SelectFieldProps = {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void // recebe só o valor, não o evento
  error?: string
  hint?: string // dica curta de como preencher, mostrada embaixo do campo
}

export function SelectField({ label, options, value, onChange, error, hint }: SelectFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
  <Field.Label>{label}</Field.Label>
  <NativeSelect.Root>
    <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
  {hint && !error && <Field.HelperText>{hint}</Field.HelperText>}
  <Field.ErrorText>{error}</Field.ErrorText>
</Field.Root>
  )
}