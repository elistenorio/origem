import { Box, Text } from "@chakra-ui/react"
import { LegalPageLayout, type LegalSection } from "@/components/institucional/LegalPageLayout"

const SECOES_TEXTO: { id: string; numero: number; titulo: string; texto: string; lista?: string[] }[] = [
  {
    id: "apresentacao",
    numero: 1,
    titulo: "Apresentação",
    texto:
      "O Origem é um marketplace que conecta artesãos e produtores criativos a compradores, com foco na origem, na técnica e no impacto de comprar de quem faz.",
  },
  {
    id: "definicao-da-plataforma",
    numero: 2,
    titulo: "Definição da plataforma",
    texto:
      "A plataforma oferece vitrine para compradores, painel para artesãos e painel administrativo. O Origem intermedia a venda, mas cada peça é produzida e enviada pelo próprio artesão.",
  },
  {
    id: "cadastro",
    numero: 3,
    titulo: "Cadastro",
    texto: "Para comprar ou vender é preciso fornecer informações verdadeiras e mantê-las atualizadas. Artesãos passam por curadoria antes de publicar peças.",
    lista: [
      "Você é responsável por manter sua senha em sigilo.",
      "Contas com dados falsos podem ser suspensas.",
    ],
  },
  {
    id: "responsabilidades-do-usuario",
    numero: 4,
    titulo: "Responsabilidades do usuário",
    texto: "Usar a plataforma de forma ética, sem publicar conteúdo ofensivo, falso ou que viole direitos de terceiros.",
  },
  {
    id: "compra-e-venda",
    numero: 5,
    titulo: "Compra e venda",
    texto:
      "O contrato de compra é firmado entre comprador e artesão, com intermediação do Origem. Preços, prazos e fretes são informados antes da finalização do pedido.",
  },
  {
    id: "conteudo",
    numero: 6,
    titulo: "Conteúdo",
    texto: "Fotos e descrições publicadas pelos artesãos são de responsabilidade deles e passam por revisão da curadoria.",
  },
  {
    id: "propriedade-intelectual",
    numero: 7,
    titulo: "Propriedade intelectual",
    texto: "A marca Origem, o layout e os textos institucionais pertencem ao Origem. As criações e imagens das peças pertencem aos respectivos artesãos.",
  },
  {
    id: "pagamentos",
    numero: 8,
    titulo: "Pagamentos",
    texto: "Os pagamentos são processados por intermediador certificado. O repasse ao artesão ocorre após a confirmação da entrega.",
  },
  {
    id: "cancelamentos",
    numero: 9,
    titulo: "Cancelamentos",
    texto:
      "O comprador pode cancelar o pedido antes do envio ou exercer o direito de arrependimento em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.",
  },
  {
    id: "alteracoes-dos-termos",
    numero: 10,
    titulo: "Alterações dos termos",
    texto: "Podemos atualizar estes termos. Mudanças relevantes serão comunicadas por e-mail e na plataforma com antecedência mínima de 15 dias.",
  },
  {
    id: "contato",
    numero: 11,
    titulo: "Contato",
    texto: "Dúvidas sobre estes termos: contato@origem.com ou WhatsApp (81) 90000-0000.",
  },
]

const SECOES: LegalSection[] = SECOES_TEXTO.map((secao) => ({
  id: secao.id,
  titulo: `${secao.numero}. ${secao.titulo}`,
  conteudo: (
    <>
      <Text color="origem.texto">{secao.texto}</Text>
      {secao.lista && (
        <Box as="ul" mt={2} pl={5} color="origem.texto">
          {secao.lista.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
      )}
    </>
  ),
}))

export default function TermosDeUsoPage() {
  return (
    <LegalPageLayout
      breadcrumbAtual="Termos de uso"
      titulo="Termos de uso"
      atualizadoEm="25 de setembro de 2026"
      intro="Estes Termos de Uso regulam o acesso e a utilização da plataforma O.R.I.G.E.M. Ao criar uma conta ou realizar uma compra, você declara que leu e concorda com as condições abaixo."
      secoes={SECOES}
    />
  )
}
