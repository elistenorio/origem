import { Checkbox } from "@chakra-ui/react"

export function AppCheckbox({ children, ...rest }: Checkbox.RootProps) {
  return (
    <Checkbox.Root {...rest}>
      <Checkbox.HiddenInput />
      <Checkbox.Control
        borderColor="origem.texto"
        borderRadius="md"
        _checked={{ bg: "origem.laranja", borderColor: "origem.laranja" }}
      />
      <Checkbox.Label color="origem.texto">{children}</Checkbox.Label>
    </Checkbox.Root>
  )
}