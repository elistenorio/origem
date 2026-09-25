"use client"

import { useState } from "react"
import { Card, chakra, Flex, HStack, Image, Stack, Tabs } from "@chakra-ui/react"
import { DataState } from "@/components/feedback/DataState"
import { filaCuradoria } from "@/dados-exemplo/consultas"
import { ArtisanPageHeader } from "@/components/artesao/ArtisanPageHeader"
import { formatDate } from "@/utils/formatDate"
import type { TipoCuradoria } from "@/dados-exemplo/tipos"
import { AdminShell } from "./AdminShell"
import { CurationDetail } from "./CurationDetail"

function Fila({ tipo }: { tipo: TipoCuradoria }) {
  // Por enquanto a fila é de exemplo; decidir só tira o item da lista local
  const [data, setData] = useState(() => filaCuradoria(tipo))
  const [selecionadoId, setSelecionadoId] = useState<string>()
  const selecionado = data.find((i) => i.id === selecionadoId) ?? data[0]

  return (
    <DataState loading={false} vazio={data.length === 0} mensagemVazio="Nenhum item aguardando análise" descricaoVazio="A fila está em dia.">
      <Flex gap="6" direction={{ base: "column", lg: "row" }} align="flex-start">
        <Stack w={{ base: "full", lg: "320px" }} gap="3" flexShrink={0} as="ul" aria-label="Aguardando análise">
          {data.map((item) => (
            <chakra.li key={item.id} listStyleType="none">
              <chakra.button type="button" w="full" textAlign="left" onClick={() => setSelecionadoId(item.id)} aria-pressed={item.id === selecionado?.id}>
                <Card.Root variant={item.id === selecionado?.id ? "destaque" : "item"}>
                  <Card.Body>
                    <HStack gap="3">
                      <Image src={item.imagemUrl} alt="" boxSize="11" borderRadius="full" objectFit="cover" />
                      <Stack gap="0">
                        <Card.Title>{item.titulo}</Card.Title>
                        <Card.Description>{item.subtitulo}</Card.Description>
                        <Card.Description>Enviado em {formatDate(item.enviadoEm)}</Card.Description>
                      </Stack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              </chakra.button>
            </chakra.li>
          ))}
        </Stack>
        {selecionado && <CurationDetail key={selecionado.id} item={selecionado} onDecidido={() => { setSelecionadoId(undefined); setData((fila) => fila.filter((i) => i.id !== selecionado.id)) }} />}
      </Flex>
    </DataState>
  )
}

// Curadoria (Tela 08 admin): fila de artesãos e peças aguardando análise.
export function CurationView() {
  return (
    <AdminShell ativo="curadoria">
      <ArtisanPageHeader titulo="Curadoria" descricao="Analise artesãos e peças antes de aparecerem no Origem." />
      <Tabs.Root defaultValue="artesaos" lazyMount unmountOnExit>
        <Tabs.List mb="6">
          <Tabs.Trigger value="artesaos">Artesãos</Tabs.Trigger>
          <Tabs.Trigger value="pecas">Peças</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="artesaos"><Fila tipo="artesaos" /></Tabs.Content>
        <Tabs.Content value="pecas"><Fila tipo="pecas" /></Tabs.Content>
      </Tabs.Root>
    </AdminShell>
  )
}
