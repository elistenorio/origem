import { chakra, HStack, Text } from "@chakra-ui/react"
import { BiChevronDown, BiX } from "react-icons/bi"

type FilterChipProps = {
  label: string
  // Um chip de menu ("Categoria ⌄", abre opções) ou um chip de filtro ativo
  // ("Cerâmica ✕", já aplicado — passe onRemove). Nunca os dois ao mesmo tempo.
  onClick?: () => void
  onRemove?: () => void
}

const pillStyle = {
  bg: "origem.categoria",
  color: "origem.texto",
  borderRadius: "full",
  px: "4",
  py: "2",
  gap: "2",
  fontSize: "sm",
  fontWeight: "medium",
} as const

export function FilterChip({ label, onClick, onRemove }: FilterChipProps) {
  if (onClick) {
    return (
      <chakra.button type="button" onClick={onClick} display="flex" alignItems="center" {...pillStyle}>
        <Text>{label}</Text>
        <BiChevronDown />
      </chakra.button>
    )
  }

  return (
    <HStack {...pillStyle}>
      <Text>{label}</Text>
      <chakra.button type="button" aria-label={`Remover filtro ${label}`} onClick={onRemove} display="flex">
        <BiX />
      </chakra.button>
    </HStack>
  )
}
