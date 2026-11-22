import { Field, Input, type InputProps } from "@chakra-ui/react"

type FormFieldProps = InputProps & {
  label: string
  error?: string
  hint?: string // dica curta de como preencher, mostrada embaixo do campo
}

export function FormField({ label, error, hint, ...inputProps }: FormFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label>{label}</Field.Label>
      <Input {...inputProps} />
      {hint && !error && <Field.HelperText>{hint}</Field.HelperText>}
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
