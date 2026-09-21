import { Field, Input, type InputProps } from "@chakra-ui/react"

type FormFieldProps = InputProps & {
  label: string
  error?: string
}

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label
        textTransform="uppercase"
        fontWeight="bold"
        color="origem.texto"
      >
        {label}
      </Field.Label>
      <Input
        bg="origem.busca"
        border="none"
        borderRadius="lg"
        color="origem.texto"
        _placeholder={{ color: "origem.textoSuave" }}
        {...inputProps}
      />
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}