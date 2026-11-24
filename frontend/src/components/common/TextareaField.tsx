import { Field, Textarea, type TextareaProps } from "@chakra-ui/react"

type TextareaFieldProps = TextareaProps & {
  label: string
  error?: string
  hint?: string // dica curta de como preencher, mostrada embaixo do campo
}

// Igual ao FormField, só que para texto longo.
export function TextareaField({ label, error, hint, ...textareaProps }: TextareaFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label>{label}</Field.Label>
      <Textarea {...textareaProps} />
      {hint && !error && <Field.HelperText>{hint}</Field.HelperText>}
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
