import { Button, type ButtonProps } from "@chakra-ui/react"

export function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      bg="origem.laranja"
      color="white"
      borderRadius="lg"
      px="8"
      _hover={{ opacity: 0.9 }}
      {...props}
    />
  )
}