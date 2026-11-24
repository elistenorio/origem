import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react"
import NextLink from "next/link"
import { FaqAccordion } from "@/components/common/FaqAccordion"
import { CATEGORIAS } from "@/constants/categorias"
import { MATERIAIS } from "@/constants/materiais"
import { TECNICAS } from "@/constants/tecnicas"
import type { Artesao } from "@/types/artesao"
import type { Produto } from "@/types/produto"
import { getOptionLabel } from "@/utils/getOptionLabel"

type ProductInfoSectionsProps = {
  produto: Produto
  artesao?: Artesao   // só vem quando o perfil está publicado; sem ele a seção mostra só o nome
}

// Seções de texto da página de detalhe: sobre a peça e ficha técnica, artesão, cuidados, entrega e trocas.
export function ProductInfoSections({ produto, artesao }: ProductInfoSectionsProps) {
  return (
    <VStack flex="1" align="stretch" gap={10} maxW="800px">

      <Box>
        <Text fontWeight="bold" fontSize="sm" mb={2}>SOBRE A PEÇA</Text>
        <Text fontSize="sm" color="origem.texto" mb={4}>
          {produto.descricao}
        </Text>
        <Text fontWeight="bold" fontSize="sm" mb={1}>Ficha Técnica</Text>
        <Text fontSize="sm" color="origem.texto" lineHeight="1.8">
          Categoria: {getOptionLabel(CATEGORIAS, produto.categoria)}<br/>
          Material: {getOptionLabel(MATERIAIS, produto.material)}<br/>
          Técnica: {getOptionLabel(TECNICAS, produto.tecnica)}<br/>
          Dimensões: {produto.medidas}<br/>
          Origem: {produto.cidade}, Pernambuco
          {produto.pecaUnica && <><br/>Peça única</>}
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="sm" mb={2}>SOBRE O ARTESÃO</Text>
        <Heading color="origem.laranja" variant="titulo" fontSize="3xl" mb={2}>{produto.artesaoNome}</Heading>
        {artesao && (
          <>
            <Text fontSize="sm" color="origem.texto" mb={4}>
              {artesao.bio}
            </Text>
            <Link asChild color="origem.laranja" fontSize="sm" textDecoration="underline">
              <NextLink href={`/artesaos/${artesao.id}`}>Conheça mais sobre {artesao.nome} →</NextLink>
            </Link>
          </>
        )}
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="sm" mb={2}>CUIDADOS COM A PEÇA</Text>
        <Text fontSize="sm" color="origem.texto" mb={2}>
          {produto.cuidados}
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="sm" mb={4}>ENTREGA</Text>

        <Text fontWeight="bold" fontSize="sm">Prazo de envio</Text>
        <Text fontSize="sm" color="origem.texto" mb={4}>
          Após a confirmação de pagamento, o pedido será preparado e enviado
          em até 3 dias úteis. O prazo de entrega varia de acordo com a localização.
        </Text>

        <Text fontWeight="bold" fontSize="sm">Embalagem</Text>
        <Text fontSize="sm" color="origem.texto" mb={4}>
          As peças são embaladas cuidadosamente para não sofrer danos
          durante o transporte. Por serem feitas de produtos artesanais...
        </Text>

        <Text fontWeight="bold" fontSize="sm">Acompanhamento</Text>
        <Text fontSize="sm" color="origem.texto" mb={4}>
          Após o envio, você receberá o código de rastreamento por e-mail para acompanhar a entrega.
        </Text>
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="sm" mb={4}>TROCAS E DEVOLUÇÕES</Text>
        <FaqAccordion
          items={["Política de troca e devolução", "Política de entrega", "Política de pagamento", "Dúvidas sobre sua compra?"].map((item) => ({
            question: item,
            answer: `Detalhes sobre ${item.toLowerCase()}...`,
          }))}
        />
      </Box>
    </VStack>
  )
}
