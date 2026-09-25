"use client"

import { useState, type FormEvent } from "react"
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react"
import { BiMapPin, BiPackage } from "react-icons/bi"
import type { IconType } from "react-icons"
import { FormField } from "@/components/common/FormField"
import { SectionCard } from "@/components/common/SectionCard"

type OpcaoFrete = {
  id: string
  nome: string
  prazo: string
  preco: number | "gratis"
  icon: IconType
}

type ResultadoFrete = {
  regiao: string
  opcoes: OpcaoFrete[]
}

// TODO(fake-api): trocar por `fretesService.calcular(cep)` (GET /frete?cep=...) quando a
// Fake API existir. Por enquanto devolve sempre o mesmo resultado, para qualquer CEP.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- cep entra em uso quando ligar na API
function buscarOpcoesFrete(cep: string): ResultadoFrete {
  return {
    regiao: "Recife/PE",
    opcoes: [
      { id: "pac", nome: "PAC", prazo: "6 a 8 dias úteis", preco: 24.9, icon: BiPackage },
      { id: "sedex", nome: "SEDEX", prazo: "2 a 3 dias úteis", preco: 42.5, icon: BiPackage },
      { id: "retirada", nome: "Retirada com o artesão", prazo: "Combinar horário", preco: "gratis", icon: BiMapPin },
    ],
  }
}

function formatarPreco(preco: OpcaoFrete["preco"]) {
  if (preco === "gratis") return "Grátis"
  return `R$ ${preco.toFixed(2).replace(".", ",")}`
}

export function FreightCalculator() {
  const [cep, setCep] = useState("")
  const [resultado, setResultado] = useState<ResultadoFrete | null>(null)
  const [erro, setErro] = useState<string>()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!cep.trim()) {
      setErro("Informe um CEP.")
      setResultado(null)
      return
    }
    setErro(undefined)
    setResultado(buscarOpcoesFrete(cep))
  }

  return (
    <SectionCard title="Calcular frete">
      <Text fontSize="sm" color="origem.textoSuave" mt={-2}>
        Simule o frete de uma peça até o seu endereço.
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <FormField
            label="CEP"
            placeholder="00000-000"
            value={cep}
            onChange={(event) => setCep(event.target.value)}
            error={erro}
          />
          <Button type="submit" variant="origem" w="full">
            Calcular
          </Button>
        </Stack>
      </form>

      {resultado && (
        <Stack gap={3}>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto">
            Resultado para {resultado.regiao}
          </Text>
          {resultado.opcoes.map((opcao) => (
            <HStack key={opcao.id} justify="space-between" bg="origem.fundo" borderRadius="lg" p={3}>
              <HStack gap={3}>
                <Box color="origem.laranja">
                  <opcao.icon size={20} />
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="origem.texto">{opcao.nome}</Text>
                  <Text fontSize="xs" color="origem.textoSuave">{opcao.prazo}</Text>
                </Box>
              </HStack>
              <Text fontWeight="bold" color="origem.texto">{formatarPreco(opcao.preco)}</Text>
            </HStack>
          ))}
        </Stack>
      )}
    </SectionCard>
  )
}
