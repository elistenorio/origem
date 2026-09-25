import { HStack, Input, type InputProps } from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"

// Campo de busca com lupa (usado na Header e em qualquer lista com filtro por texto).
export function SearchField(props: InputProps) {
  return (
    <HStack bg="origem.busca" borderRadius="md" px={4} py={2} w="full" color="origem.textoSuave">
      <BiSearch />
      <Input variant="unstyled" {...props} />
    </HStack>
  )
}
