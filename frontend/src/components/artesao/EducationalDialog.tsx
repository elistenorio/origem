"use client"

import { useState } from "react"
import { Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react"
import { BiInfoCircle, BiDesktop, BiBasket, BiMoney, BiStar } from "react-icons/bi"
import { OrigemDialog } from "@/components/common/OrigemDialog"

const EXPLICACOES = [
  { icone: <BiDesktop />, titulo: "Peças publicadas", texto: "É a quantidade de peças que estão no site agora, prontas para as pessoas verem e comprarem. Quanto mais peças bonitas você publicar, mais chances de vender." },
  { icone: <BiBasket />, titulo: "Peças vendidas", texto: "É quantas peças você vendeu nos últimos 7 dias. Se o número for pequeno, não desanime! Publicar peças novas e com boas fotos ajuda a vender mais." },
  { icone: <BiMoney />, titulo: "Vendas do mês", texto: "É o total de dinheiro que você recebeu com as vendas no último mês (30 dias)." },
  { icone: <BiStar />, titulo: "Avaliação", texto: "É a nota que os clientes dão depois de comprar, de 1 a 5. Uma nota alta faz mais pessoas confiarem na sua loja." },
]

// Botão de ajuda + pop-up educativo da tela inicial do artesão (Tela 04.1).
export function EducationalDialog() {
  const [aberto, setAberto] = useState(false)
  return (
    <>
      <IconButton aria-label="Entenda seus números" variant="claro" borderRadius="full" color="origem.laranja" onClick={() => setAberto(true)}>
        <BiInfoCircle />
      </IconButton>
      <OrigemDialog
        open={aberto}
        onClose={() => setAberto(false)}
        titulo="Entenda seus números"
        rodape={<Button variant="origem" w="full" onClick={() => setAberto(false)}>Entendi</Button>}
      >
        <Stack gap="5">
          {EXPLICACOES.map((e) => (
            <HStack key={e.titulo} gap="4" align="flex-start">
              <Text as="span" fontSize="2xl" color="origem.laranja">{e.icone}</Text>
              <Stack gap="1">
                <Text textStyle="rotulo">{e.titulo}</Text>
                <Text>{e.texto}</Text>
              </Stack>
            </HStack>
          ))}
        </Stack>
      </OrigemDialog>
    </>
  )
}
