import { Field, Textarea, type TextareaProps } from "@chakra-ui/react"

type TextareaFieldProps = TextareaProps & {
  label: string
  error?: string
}

// Igual ao FormField, só que para texto longo.
export function TextareaField({ label, error, ...textareaProps }: TextareaFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label>{label}</Field.Label>
      <Textarea {...textareaProps} />
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
