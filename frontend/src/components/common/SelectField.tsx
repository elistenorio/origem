import { Field, NativeSelect } from "@chakra-ui/react"
import { inputStyle, labelStyle } from "@/theme/formStyles"

type Option = { value: string; label: string }

type SelectFieldProps = {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void // recebe só o valor, não o evento
  error?: string
}

export function SelectField({ label, options, value, onChange, error }: SelectFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label {...labelStyle}>{label}</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          {...inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator color="origem.texto" />
      </NativeSelect.Root>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}