import { Card, Flex, type CardRootProps } from "@chakra-ui/react"

type PanelProps = Omit<CardRootProps, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode      // à direita do título (link "Ver todos", botão...)
}

// Painel bege com título. Estilo vem da recipe "card" (variante origem).
export function Panel({ title, description, actions, children, ...rest }: PanelProps) {
  return (
    <Card.Root variant="origem" {...rest}>
      {(title || actions) && (
        <Card.Header>
          <Flex justify="space-between" align="center" gap="3" wrap="wrap">
            {title && <Card.Title>{title}</Card.Title>}
            {actions}
          </Flex>
          {description && <Card.Description>{description}</Card.Description>}
        </Card.Header>
      )}
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  )
}
