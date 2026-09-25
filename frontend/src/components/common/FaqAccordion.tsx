import { Accordion, Text } from "@chakra-ui/react"

export type FaqItem = { question: string; answer: React.ReactNode }

// Sanfona de pergunta/resposta usada em "Trocas e devoluções" e afins.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root collapsible>
      {items.map((item) => (
        <Accordion.Item key={item.question} value={item.question} mb={2} border="none">
          <Accordion.ItemTrigger bg="origem.passoFundo" p={4} borderRadius="md" _hover={{ bg: "origem.busca" }}>
            <Text fontSize="sm" fontWeight="medium" color="origem.texto">{item.question}</Text>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent p={4} bg="origem.fundo">
            <Text fontSize="sm" color="origem.textoSuave">{item.answer}</Text>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
