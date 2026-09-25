import NextLink from "next/link"
import { Button, Stack } from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/bi"
import { OrigemDialog } from "@/components/common/OrigemDialog"

type LoginPromptDialogProps = { open: boolean; onClose: () => void }

// Pop-up "Entrar na sua conta" (Tela 06.5). Na Avaliação 1 não há login real:
// o comprador pode ir para a tela de login ou seguir como visitante.
export function LoginPromptDialog({ open, onClose }: LoginPromptDialogProps) {
  return (
    <OrigemDialog open={open} onClose={onClose} titulo="Entrar na sua conta" descricao="Entre para acompanhar o pedido e salvar seus dados para as próximas compras.">
      <Stack gap="3" pb="4">
        <Button asChild variant="origem">
          <NextLink href="/login">
            Entrar <BiRightArrowAlt />
          </NextLink>
        </Button>
        <Button asChild variant="outline">
          <NextLink href="/cadastro/comprador">Criar conta</NextLink>
        </Button>
        <Button variant="claro" onClick={onClose}>
          Continuar como visitante
        </Button>
      </Stack>
    </OrigemDialog>
  )
}
