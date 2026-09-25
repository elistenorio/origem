"use client"

import { useEffect, useState } from "react"
import { Box, Button, HStack, Stack, Switch, Text } from "@chakra-ui/react"
import { BiCheck } from "react-icons/bi"
import { SectionCard } from "@/components/common/SectionCard"
import { useCookiePreferencesStore, type CookiePreferences } from "@/store/cookiePreferencesStore"

const ITENS: { key: keyof CookiePreferences; label: string; description: string }[] = [
  { key: "desempenho", label: "Desempenho", description: "Nos ajudam a melhorar a plataforma." },
  { key: "funcionais", label: "Funcionais", description: "Lembram suas escolhas." },
  { key: "marketing", label: "Marketing", description: "Personalizam anúncios fora do Origem." },
]

export function CookiePreferencesPanel() {
  const preferencias = useCookiePreferencesStore((state) => state.preferencias)
  const definirPreferencias = useCookiePreferencesStore((state) => state.definirPreferencias)
  const recusarOpcionais = useCookiePreferencesStore((state) => state.recusarOpcionais)

  // Os toggles são um rascunho local; só viram preferência de verdade ao clicar
  // em "Salvar". Sincroniza com o que está salvo só depois de montar no
  // navegador (o servidor não tem acesso ao localStorage).
  const [rascunho, setRascunho] = useState<CookiePreferences>(preferencias)
  useEffect(() => {
    // O zustand/persist hidrata o localStorage de forma assíncrona (só depois de montar,
    // pra não conflitar com o HTML vindo do servidor). Isso sincroniza o rascunho uma
    // única vez quando o valor salvo chega — não é o padrão de "estado derivado".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRascunho(preferencias)
  }, [preferencias])

  function alternar(chave: keyof CookiePreferences, valor: boolean) {
    setRascunho((atual) => ({ ...atual, [chave]: valor }))
  }

  return (
    <SectionCard title="Suas preferências de cookies">
      <Stack gap={5}>
        <HStack justify="space-between" opacity={0.7}>
          <Box>
            <Text fontWeight="bold" color="origem.texto">Essenciais (sempre ativos)</Text>
            <Text fontSize="sm" color="origem.textoSuave">
              Necessários para o site funcionar. Não podem ser desativados.
            </Text>
          </Box>
          <Switch.Root checked disabled>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>

        {ITENS.map((item) => (
          <HStack key={item.key} justify="space-between">
            <Box>
              <Text fontWeight="bold" color="origem.texto">{item.label}</Text>
              <Text fontSize="sm" color="origem.textoSuave">{item.description}</Text>
            </Box>
            <Switch.Root
              checked={rascunho[item.key]}
              onCheckedChange={(e) => alternar(item.key, e.checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </HStack>
        ))}
      </Stack>

      <HStack justify="flex-end" gap={4} mt={2}>
        <Button variant="ghost" color="origem.texto" onClick={recusarOpcionais}>
          Recusar opcionais
        </Button>
        <Button variant="origem" onClick={() => definirPreferencias(rascunho)}>
          <BiCheck /> Salvar preferências
        </Button>
      </HStack>
    </SectionCard>
  )
}
