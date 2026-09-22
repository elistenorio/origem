"use client"

import { useRef, useState } from "react"
import { Box, chakra, Field, Text } from "@chakra-ui/react"
import { IoShareOutline } from "react-icons/io5"

const TIPOS_ACEITOS = ["image/png", "image/jpeg"]
const TAMANHO_MAXIMO = 5 * 1024 * 1024 // 5 MB

type FileFieldProps = {
  label?: string // rótulo acessível (a seção já mostra o título visível)
  value: File[]
  onChange: (files: File[]) => void
  multiple?: boolean
}

export function FileField({ label, value, onChange, multiple = false }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()

  function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? [])
    if (files.length === 0) return

    const invalido = files.find(
      (file) => !TIPOS_ACEITOS.includes(file.type) || file.size > TAMANHO_MAXIMO,
    )
    if (invalido) {
      setError(`"${invalido.name}" não é PNG/JPG ou passa de 5 MB.`)
      return
    }

    setError(undefined)
    onChange(files)
  }

  const texto =
    value.length > 0
      ? value.map((file) => file.name).join(", ")
      : "Anexe uma foto (PNG ou JPG, até 5 MB por arquivo)"

  return (
    <Field.Root invalid={!!error} w="full">
      <input
        ref={inputRef}
        type="file"
        accept={TIPOS_ACEITOS.join(",")}
        multiple={multiple}
        hidden
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = "" // permite escolher o mesmo arquivo de novo
        }}
      />
      <chakra.button
        type="button"
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        w="full"
        minH="50px"
        px="4"
        bg="origem.busca"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="3"
        textAlign="left"
        cursor="pointer"
        color={value.length > 0 ? "origem.texto" : "origem.textoSuave"}
        _focusVisible={{
          outlineWidth: "2px",
          outlineStyle: "solid",
          outlineColor: "origem.laranja",
          outlineOffset: "2px",
        }}
      >
        <Text as="span" truncate>
          {texto}
        </Text>
        <Box as="span" color="origem.texto" fontSize="xl" flexShrink={0}>
          <IoShareOutline />
        </Box>
      </chakra.button>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  )
}
