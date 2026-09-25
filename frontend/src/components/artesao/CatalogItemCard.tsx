import { Box, Button, HStack, IconButton, Image, Stack, Text } from "@chakra-ui/react"
import { BiPencil, BiHide, BiShow } from "react-icons/bi"
import { StatusBadge, type StatusKey } from "@/components/common/StatusBadge"
import { Price } from "@/components/common/Price"
import { Tile } from "@/components/common/Tile"

type CatalogItemCardProps = {
  title: string
  imageUrl: string
  category: string
  stock: number
  updatedAt: string // já formatado, ex.: "20/09/2026"
  price: number
  status: StatusKey
  visible?: boolean
  onEdit?: () => void
  onView?: () => void
  onToggleVisibility?: () => void
}

// Card do "Meu Catálogo" do artesão — diferente do ProductCard público:
// aqui o dono da peça vê status, estoque e ações de gestão, não o comprador.
export function CatalogItemCard({
  title,
  imageUrl,
  category,
  stock,
  updatedAt,
  price,
  status,
  visible = true,
  onEdit,
  onView,
  onToggleVisibility,
}: CatalogItemCardProps) {
  return (
    <Tile p={4}>
      <HStack align="flex-start" gap="4">
        <Box position="relative" flexShrink={0}>
          <Image src={imageUrl} alt={title} boxSize="80px" borderRadius="md" objectFit="cover" />
          <Box position="absolute" top="-2" left="-2">
            <StatusBadge status={status} fontSize="2xs" />
          </Box>
        </Box>

        <Stack flex="1" gap="1">
          <Text fontWeight="bold" color="origem.texto">{title}</Text>
          <Text fontSize="xs" color="origem.textoSuave">
            {category} · Estoque: {stock} {stock === 1 ? "unidade" : "unidades"} · Atualizado em {updatedAt}
          </Text>
          <IconButton
            aria-label={visible ? "Ocultar da loja" : "Mostrar na loja"}
            variant="ghost"
            size="xs"
            onClick={onToggleVisibility}
            alignSelf="flex-start"
          >
            {visible ? <BiShow /> : <BiHide />}
          </IconButton>
        </Stack>

        <Stack gap="3" alignSelf="center" align="flex-end">
          <Price valor={price} fontSize="md" fontWeight="bold" color="origem.texto" />
          <HStack gap="2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <BiPencil /> Editar
            </Button>
            <Button variant="outline" size="sm" onClick={onView}>
              Visualizar
            </Button>
          </HStack>
        </Stack>
      </HStack>
    </Tile>
  )
}
