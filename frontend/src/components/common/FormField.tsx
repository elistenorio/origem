import { Field, Input, type InputProps } from "@chakra-ui/react"

type FormFieldProps = InputProps & {
  label: string
  error?: string
}

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label>{label}</Field.Label>
      <Input {...inputProps} />
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
