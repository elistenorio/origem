import NextLink from "next/link"
import { Heading, Link, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { FaqAccordion, type FaqItem } from "@/components/common/FaqAccordion"
import { CATEGORIAS } from "@/constants/categorias"
import { MATERIAIS } from "@/constants/materiais"
import { REGIOES } from "@/constants/regioes"
import { TECNICAS } from "@/constants/tecnicas"
import { getOptionLabel } from "@/utils/getOptionLabel"
import type { Produto } from "@/types/produto"

const ENTREGA = [
  { titulo: "Prazo de envio", texto: "Depois da confirmação do pagamento, o artesão prepara e posta a peça em até 3 dias úteis. O prazo total depende do seu CEP." },
  { titulo: "Embalagem", texto: "As peças são embaladas com proteção reforçada para chegar inteiras, mesmo as mais frágeis." },
  { titulo: "Acompanhamento", texto: "Assim que a peça for postada, você recebe o código de rastreio por e-mail e acompanha tudo em Meus pedidos." },
]

const TROCAS: FaqItem[] = [
  { question: "Posso desistir da compra?", answer: "Sim, em até 7 dias corridos depois de receber a peça, sem precisar justificar. O primeiro envio de devolução é gratuito." },
  { question: "E se a peça tiver defeito?", answer: "Você tem até 30 dias para pedir troca ou reembolso de peças com defeito de fabricação. O frete fica por conta do Origem." },
  { question: "A peça chegou danificada. E agora?", answer: "Avise em até 48 horas pelo pedido, com fotos da peça e da embalagem. Você escolhe entre uma nova peça (quando houver) ou o reembolso integral." },
  { question: "Pequenas diferenças de cor são defeito?", answer: "Não. Variações de cor, textura e tamanho fazem parte do feito à mão e tornam cada peça única." },
]

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Stack gap="4">
      <Heading as="h2" variant="secao" fontSize="lg">{titulo}</Heading>
      {children}
    </Stack>
  )
}

// Coluna principal da página da peça: descrição, ficha técnica, cuidados, entrega e trocas.
export function ProductDetails({ produto }: { produto: Produto }) {
  const ficha = [
    { rotulo: "Categoria", valor: getOptionLabel(CATEGORIAS, produto.categoria) },
    { rotulo: "Técnica", valor: getOptionLabel(TECNICAS, produto.tecnica) },
    { rotulo: "Material", valor: getOptionLabel(MATERIAIS, produto.material) },
    { rotulo: "Medidas", valor: produto.medidas },
    { rotulo: "Origem", valor: `${produto.cidade}, ${getOptionLabel(REGIOES, produto.regiao)}` },
    { rotulo: "Tipo", valor: produto.pecaUnica ? "Peça única" : "Produção artesanal em pequena escala" },
  ]

  return (
    <Stack gap="8" flex="1" minW="0" separator={<Separator borderColor="origem.passoFundo" />}>
      <Secao titulo="Sobre a peça">
        <Text>{produto.descricao}</Text>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
          {ficha.map((item) => (
            <Stack key={item.rotulo} gap="0">
              <Text textStyle="rotulo">{item.rotulo}</Text>
              <Text>{item.valor}</Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Secao>

      <Secao titulo="Cuidados com a peça">
        <Text>{produto.cuidados}</Text>
      </Secao>

      <Secao titulo="Entrega">
        {ENTREGA.map((item) => (
          <Stack key={item.titulo} gap="1">
            <Text textStyle="rotulo">{item.titulo}</Text>
            <Text>{item.texto}</Text>
          </Stack>
        ))}
        <Link asChild variant="origem">
          <NextLink href="/ajuda/entregas-e-frete">Prazos por região →</NextLink>
        </Link>
      </Secao>

      <Secao titulo="Trocas e devoluções">
        <FaqAccordion items={TROCAS} />
        <Link asChild variant="origem">
          <NextLink href="/ajuda/trocas-e-devolucoes">Política completa de trocas →</NextLink>
        </Link>
      </Secao>
    </Stack>
  )
}
