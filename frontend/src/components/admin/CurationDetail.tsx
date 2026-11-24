"use client"

import { useState } from "react"
import { Box, Button, Card, Flex, Heading, HStack, Image, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiFile } from "react-icons/bi"
import { Tile } from "@/components/common/Tile"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Timeline } from "@/components/common/Timeline"
import { TextareaField } from "@/components/common/TextareaField"
import { ApiError } from "@/services/api"
import { adminService } from "@/services/admin.service"
import { formatDateTime } from "@/utils/formatDate"
import type { DecisaoCuradoria, ItemCuradoria } from "@/types/admin"

type CurationDetailProps = { item: ItemCuradoria; onDecidido: (decisao: DecisaoCuradoria) => void }

// Detalhes de um item da fila da curadoria + parecer e decisão.
export function CurationDetail({ item, onDecidido }: CurationDetailProps) {
  const [parecer, setParecer] = useState("")
  const [faltaParecer, setFaltaParecer] = useState(false)
  const [enviando, setEnviando] = useState<DecisaoCuradoria>()
  const [erro, setErro] = useState<string>()

  async function handleDecidir(decisao: DecisaoCuradoria) {
    const texto = parecer.trim()
    setFaltaParecer(decisao !== "aprovar" && !texto)
    if (decisao !== "aprovar" && !texto) return
    setEnviando(decisao)
    setErro(undefined)
    try {
      await adminService.decidirCuradoria(item.tipo, item.id, { decisao, parecer: texto })
      setParecer("")
      onDecidido(decisao)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível registrar a decisão.")
    } finally {
      setEnviando(undefined)
    }
  }

  return (
    <Tile flex="1" w="full">
      <Stack gap="6">
        <Flex gap="5" align="center" direction={{ base: "column", sm: "row" }}>
          <Image src={item.imagemUrl} alt={item.titulo} boxSize="24" borderRadius="full" objectFit="cover" />
          <Stack gap="1">
            <StatusBadge status="emAnalise" alignSelf="flex-start" />
            <Heading as="h2" variant="titulo" fontSize="4xl">{item.titulo}</Heading>
            <Text textStyle="apoio">{item.subtitulo} · enviado em {formatDateTime(item.enviadoEm)}</Text>
          </Stack>
        </Flex>

        <Stack gap="3">
          <Text textStyle="rotulo">Fotos</Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="3">
            {item.fotos.map((src) => <Image key={src} src={src} alt="" h="130px" w="full" objectFit="cover" borderRadius="lg" />)}
          </SimpleGrid>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: item.trajetoria ? 2 : 1 }} gap="5">
          <Stack gap="2"><Text textStyle="rotulo">Descrição</Text><Text>{item.descricao}</Text></Stack>
          {item.trajetoria && <Stack gap="2"><Text textStyle="rotulo">Trajetória</Text><Text>{item.trajetoria}</Text></Stack>}
        </SimpleGrid>

        {item.documentos.length > 0 && (
          <Stack gap="2">
            <Text textStyle="rotulo">Documentos</Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="3">
              {item.documentos.map((d) => (
                <Card.Root key={d.nome} variant="item">
                  <Card.Body>
                    <HStack gap="3"><Box color="origem.laranja" fontSize="xl"><BiFile /></Box><Stack gap="0"><Card.Title>{d.nome}</Card.Title><Card.Description>{d.tamanho}</Card.Description></Stack></HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Stack>
        )}

        {item.comprovacoes && item.comprovacoes.length > 0 && (
          <Stack gap="2">
            <Text textStyle="rotulo">Comprovações</Text>
            <Stack gap="1" as="dl">
              {item.comprovacoes.map((c, i) => (
                <HStack key={`${c.rotulo}-${i}`} gap="2" align="flex-start" wrap="wrap">
                  <Text as="dt" fontWeight="bold">{c.rotulo}:</Text>
                  <Text as="dd" wordBreak="break-all">
                    {/^https?:\/\//i.test(c.valor) ? <Link href={c.valor} target="_blank" rel="noopener noreferrer" variant="origem">{c.valor}</Link> : c.valor}
                  </Text>
                </HStack>
              ))}
            </Stack>
          </Stack>
        )}

        <Stack gap="2">
          <Text textStyle="rotulo">Histórico de análise</Text>
          <Timeline eventos={item.historico} />
        </Stack>

        <TextareaField
          label="Parecer da curadoria"
          placeholder="Obrigatório para solicitar ajustes ou recusar."
          value={parecer}
          onChange={(e) => setParecer(e.target.value)}
          error={faltaParecer ? "Escreva o parecer para solicitar ajustes ou recusar." : undefined}
        />
        {erro && <Text color="origem.perigo" fontSize="sm" role="alert">{erro}</Text>}
        <Flex gap="3" justify="space-between" wrap="wrap">
          <Button variant="perigo" onClick={() => handleDecidir("recusar")} loading={enviando === "recusar"} disabled={!!enviando}>Recusar</Button>
          <HStack gap="3">
            <Button variant="secundario" onClick={() => handleDecidir("ajustes")} loading={enviando === "ajustes"} disabled={!!enviando}>Solicitar ajustes</Button>
            <Button variant="origem" onClick={() => handleDecidir("aprovar")} loading={enviando === "aprovar"} disabled={!!enviando}>Aprovar</Button>
          </HStack>
        </Flex>
      </Stack>
    </Tile>
  )
}
