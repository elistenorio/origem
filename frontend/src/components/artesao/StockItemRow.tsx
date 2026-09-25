import { Box, Button, HStack, IconButton, Image, Text } from "@chakra-ui/react"
import { BiShow, BiX } from "react-icons/bi"
import { StatusBadge, type StatusKey } from "@/components/common/StatusBadge"

type StockItemRowProps = {
  title: string
  code: string // ex.: "ORG-0012"
  category: string
  imageUrl: string
  quantity: number // estoque atual
  minQuantity: number // estoque mínimo antes de virar "baixo estoque"
  status: StatusKey
  onEditQuantity?: () => void
  onRemove?: () => void
  onView?: () => void
}

// Linha de uma lista de estoque/pedidos (gestão do artesão).
export function StockItemRow({
  title,
  code,
  category,
  imageUrl,
  quantity,
  minQuantity,
  status,
  onEditQuantity,
  onRemove,
  onView,
}: StockItemRowProps) {
  return (
    <HStack gap="4" py="3" borderBottomWidth="1px" borderColor="origem.passoFundo">
      <Image src={imageUrl} alt={title} boxSize="48px" borderRadius="md" objectFit="cover" flexShrink={0} />

      <Box flex="1" minW="0">
        <Text fontWeight="bold" fontSize="sm" color="origem.texto" truncate>{title}</Text>
        <Text fontSize="xs" color="origem.textoSuave">Cód. {code}</Text>
      </Box>

      <Text fontSize="sm" color="origem.textoSuave" w="140px" display={{ base: "none", md: "block" }}>
        {category}
      </Text>

      <HStack gap="1" w="70px" justify="center" fontWeight="bold" color="origem.texto">
        <Text>{quantity}</Text>
        <Text color="origem.textoSuave" fontWeight="normal">/ {minQuantity}</Text>
      </HStack>

      <StatusBadge status={status} />

      <Button variant="tracejado" size="sm" onClick={onEditQuantity}>
        Editar qtd.
      </Button>

      <IconButton aria-label="Remover da lista" variant="ghost" size="sm" onClick={onRemove}>
        <BiX />
      </IconButton>
      <IconButton aria-label="Visualizar peça" variant="ghost" size="sm" onClick={onView}>
        <BiShow />
      </IconButton>
    </HStack>
  )
}
