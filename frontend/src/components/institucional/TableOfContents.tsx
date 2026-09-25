"use client"

import { useEffect, useState } from "react"
import { Link, Stack } from "@chakra-ui/react"

type Item = { id: string; label: string }

const LINHA_DE_LEITURA = 140 // px do topo da tela; a seção ativa é a última que já passou daqui

// Sumário lateral de uma página longa: destaca a seção visível na tela conforme
// o leitor rola a página (sem precisar de estado vindo de fora).
export function TableOfContents({ items }: { items: Item[] }) {
  const [ativo, setAtivo] = useState(items[0]?.id)

  useEffect(() => {
    let quadro = 0

    function atualizar() {
      // No fim da página, a última seção pode nunca alcançar a linha de leitura
      // (não sobra conteúdo abaixo dela para "empurrá-la" pra cima) — force o
      // último item nesse caso.
      const noFimDaPagina =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (noFimDaPagina) {
        setAtivo(items[items.length - 1]?.id)
        return
      }

      let atual = items[0]?.id
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= LINHA_DE_LEITURA) {
          atual = item.id
        }
      }
      setAtivo(atual)
    }

    function aoRolar() {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(atualizar)
    }

    atualizar()
    window.addEventListener("scroll", aoRolar, { passive: true })
    return () => {
      window.removeEventListener("scroll", aoRolar)
      cancelAnimationFrame(quadro)
    }
  }, [items])

  return (
    <Stack as="nav" gap={2}>
      {items.map((item) => {
        const isAtivo = ativo === item.id
        return (
          <Link
            key={item.id}
            href={`#${item.id}`}
            fontSize="sm"
            fontWeight={isAtivo ? "bold" : "normal"}
            color={isAtivo ? "origem.laranja" : "origem.texto"}
            _hover={{ textDecoration: "underline" }}
          >
            {item.label}
          </Link>
        )
      })}
    </Stack>
  )
}
