"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Alert, Box, Button, Flex, Grid, Heading, Image, Separator, Stack, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { TextareaField } from "@/components/common/TextareaField"
import { TechniquesField } from "@/components/cadastro/TechniquesField"
import { CATEGORIAS } from "@/constants/categorias"
import { TEMPO_ATUACAO } from "@/constants/artesao"
import { ApiError } from "@/services/api"
import { minhaContaService } from "@/services/minhaConta.service"
import { formularioParaPerfil, perfilParaFormulario, validarPerfil, type FormularioPerfil } from "@/utils/perfilArtesao"
import type { PerfilArtesao } from "@/types/artesao"
import { Greeting } from "./Greeting"

const selecione = (opcoes: { value: string; label: string }[]) => [{ value: "", label: "Selecione" }, ...opcoes]

type ArtisanProfileFormProps = { perfil: PerfilArtesao }

// Formulário de "Meu perfil": dados de contato, histórias e trabalho. Salva com PUT /minha-conta/perfil.
export function ArtisanProfileForm({ perfil }: ArtisanProfileFormProps) {
  const [dados, setDados] = useState<FormularioPerfil>(() => perfilParaFormulario(perfil))
  const [erros, setErros] = useState<ReturnType<typeof validarPerfil>>({})
  const [salvando, setSalvando] = useState(false)
  const [resultado, setResultado] = useState<{ tipo: "success" | "error"; mensagem: string }>()

  const alterar = <K extends keyof FormularioPerfil>(campo: K, valor: FormularioPerfil[K]) => {
    setDados((d) => ({ ...d, [campo]: valor }))
    setResultado(undefined)
  }
  const campo = (nome: "nome" | "cidade" | "estado" | "telefone") => ({
    value: dados[nome], error: erros[nome], onChange: (e: React.ChangeEvent<HTMLInputElement>) => alterar(nome, e.target.value),
  })
  const textoLongo = (nome: "historia" | "trabalho" | "origemTrabalho" | "gostaDeFazer") => ({
    value: dados[nome], error: erros[nome], onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => alterar(nome, e.target.value),
  })

  async function salvar() {
    const encontrados = validarPerfil(dados)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0) {
      setResultado({ tipo: "error", mensagem: "Revise os campos destacados." })
      return
    }
    setSalvando(true)
    try {
      setDados(perfilParaFormulario(await minhaContaService.atualizarPerfil(formularioParaPerfil(dados))))
      setResultado({ tipo: "success", mensagem: "Perfil salvo." })
    } catch (e) {
      setResultado({ tipo: "error", mensagem: e instanceof ApiError ? e.message : "Não foi possível salvar o perfil. Tente de novo." })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Flex gap="10" direction={{ base: "column", lg: "row" }} align="flex-start">
      {/* Ações: ficam paradas na tela enquanto o artesão rola o formulário */}
      <Stack w={{ base: "full", lg: "220px" }} gap="4" position={{ lg: "sticky" }} top={{ lg: "100px" }} flexShrink={0}>
        <Button variant="origem" w="full" onClick={salvar} loading={salvando}>Salvar alterações</Button>
        <Button asChild variant="claro" w="full">
          <NextLink href={`/artesaos/${perfil.id}`}>Ver como fica</NextLink>
        </Button>
        {resultado && (
          <Alert.Root status={resultado.tipo} aria-live="polite">
            <Alert.Indicator />
            <Alert.Title>{resultado.mensagem}</Alert.Title>
          </Alert.Root>
        )}
      </Stack>

      <Stack flex="1" maxW="720px" gap="8" w="full">
        <Flex gap="6" align="center" wrap="wrap">
          <Image src={perfil.fotoUrl} alt={`Foto de ${perfil.nome}`} w="120px" h="150px" objectFit="cover" borderRadius="xl" />
          <Box flex="1" minW="240px">
            <Greeting mb={1} />
            <FormField label="Seu nome no Origem" hint="Nome pelo qual você quer ser apresentado aos compradores." {...campo("nome")} />
          </Box>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="6">
          <FormField label="Cidade" {...campo("cidade")} />
          <FormField label="Estado" hint="2 letras, ex.: PE" maxLength={2} {...campo("estado")} />
          <FormField label="Email" value={perfil.email} disabled hint="O email não pode ser trocado por aqui." />
          <FormField label="Telefone ou WhatsApp" type="tel" placeholder="(DDD) 00000-0000" hint="Opcional. A equipe usa para falar com você." {...campo("telefone")} />
        </Grid>

        <Separator borderColor="origem.passoInativo" />

        <Box>
          <Heading as="h2" variant="secao" mb="6">Sobre você</Heading>
          <Stack gap="6">
            <TextareaField label="Sua história" hint="Como você começou e quem te ensinou." minH="120px" resize="vertical" {...textoLongo("historia")} />
            <TextareaField label="Seu trabalho (opcional)" minH="120px" resize="vertical" {...textoLongo("trabalho")}
              placeholder="Quais peças você faz, com quais materiais e técnicas, e como é o seu processo." />
            <TextareaField label="De onde vem o seu trabalho? (opcional)" minH="120px" resize="vertical" {...textoLongo("origemTrabalho")}
              placeholder="As pessoas, lugares e tradições que fazem parte da sua trajetória." />
            <TextareaField label="O que você gosta de fazer? (opcional)" minH="120px" resize="vertical" {...textoLongo("gostaDeFazer")}
              placeholder="As peças, técnicas ou etapas do trabalho de que você mais gosta." />
          </Stack>
        </Box>

        <Separator borderColor="origem.passoInativo" />

        <Box>
          <Heading as="h2" variant="secao" mb="6">Sobre o seu trabalho</Heading>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6" mb="8">
            <SelectField label="Tempo de atuação" options={selecione(TEMPO_ATUACAO)} value={dados.tempoAtuacao} onChange={(v) => alterar("tempoAtuacao", v)} />
            <SelectField label="Área de atuação" options={selecione(CATEGORIAS)} value={dados.categorias[0] ?? ""}
              onChange={(v) => alterar("categorias", v ? [v, ...dados.categorias.slice(1).filter((c) => c !== v)] : dados.categorias.slice(1))}
              error={erros.categorias} />
          </Grid>
          <TechniquesField
            selected={dados.tecnicasMarcadas}
            onChange={(v) => alterar("tecnicasMarcadas", v)}
            other={dados.outrasTecnicas}
            onOtherChange={(v) => alterar("outrasTecnicas", v)}
          />
        </Box>

        <Text textStyle="apoio">
          As mudanças aparecem no seu perfil público assim que você salvar.
        </Text>
      </Stack>
    </Flex>
  )
}
