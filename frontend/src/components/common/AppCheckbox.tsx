import { Checkbox } from "@chakra-ui/react"

export function AppCheckbox({ children, ...rest }: Checkbox.RootProps) {
  return (
    <Checkbox.Root {...rest}>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{children}</Checkbox.Label>
    </Checkbox.Root>
  )
}