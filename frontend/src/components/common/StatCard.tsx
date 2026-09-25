import { Heading, Text } from "@chakra-ui/react"
import { Tile } from "./Tile"

interface StatCardProps {
  title: string
  subtitle: string
  value: React.ReactNode
}

// Card de número em destaque (painéis do artesão e do admin).
export function StatCard({ title, subtitle, value }: StatCardProps) {
  return (
    <Tile display="flex" flexDirection="column" gap={2} flex="1" minW="200px">
      <Heading variant="secao" fontSize="sm">
        {title}
      </Heading>
      <Text color="origem.textoSuave" fontSize="xs" minH="32px">
        {subtitle}
      </Text>
      {/* as="div": value pode trazer outro Text (<p>) dentro, e <p> não aceita <p> aninhado */}
      <Text as="div" color="origem.laranja" fontFamily="heading" fontSize="5xl" textAlign="center" mt={2} lineHeight="1">
        {value}
      </Text>
    </Tile>
  )
}
