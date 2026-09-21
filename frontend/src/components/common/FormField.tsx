import { Field, Input, type InputProps } from "@chakra-ui/react"
import { inputStyle, labelStyle } from "@/theme/formStyles"

type FormFieldProps = InputProps & {
  label: string
  error?: string
}

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label {...labelStyle}>{label}</Field.Label>
      <Input {...inputStyle} {...inputProps} />
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}