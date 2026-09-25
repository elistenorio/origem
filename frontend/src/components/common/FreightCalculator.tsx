"use client"

import { useState, type FormEvent } from "react"
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react"
import { BiPackage } from "react-icons/bi"
import { FormField } from "@/components/common/FormField"
import { SectionCard } from "@/components/common/SectionCard"
import { ApiError } from "@/services/api"
import { freteService } from "@/services/frete.service"
import { formatCurrency } from "@/utils/formatCurrency"
import type { OpcaoFrete } from "@/types/frete"

// Simulação de frete (detalhe da peça e página de ajuda): GET /frete?cep=.
// A API valida o CEP e manda a mensagem de erro.
export function FreightCalculator() {
  const [cep, setCep] = useState("")
  const [opcoes, setOpcoes] = useState<OpcaoFrete[] | null>(null)
  const [erro, setErro] = useState<string>()
  const [calculando, setCalculando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCalculando(true)
    setErro(undefined)
    try {
      setOpcoes(await freteService.calcular(cep))
    } catch (e) {
      setOpcoes(null)
      setErro(e instanceof ApiError ? e.message : "Não foi possível calcular o frete.")
    } finally {
      setCalculando(false)
    }
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
          <Button type="submit" variant="origem" w="full" loading={calculando}>
            Calcular
          </Button>
        </Stack>
      </form>

      {opcoes && (
        <Stack gap={3}>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto">
            Resultado para o CEP {cep}
          </Text>
          {opcoes.map((opcao) => (
            <HStack key={opcao.modalidade} justify="space-between" bg="origem.fundo" borderRadius="lg" p={3}>
              <HStack gap={3}>
                <Box color="origem.laranja">
                  <BiPackage size={20} />
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="origem.texto">{opcao.nome}</Text>
                  <Text fontSize="xs" color="origem.textoSuave">{opcao.prazo}</Text>
                </Box>
              </HStack>
              <Text fontWeight="bold" color="origem.texto">{formatCurrency(opcao.valor)}</Text>
            </HStack>
          ))}
        </Stack>
      )}
    </SectionCard>
  )
}
