import NextLink from "next/link"
import { Box, Link, Text } from "@chakra-ui/react"
import { LegalPageLayout, type LegalSection } from "@/components/institucional/LegalPageLayout"

const SECOES: LegalSection[] = [
  {
    id: "dados-coletados",
    titulo: "1. Dados coletados",
    conteudo: (
      <>
        <Text color="origem.texto">Coletamos apenas o necessário para oferecer nossos serviços.</Text>
        <Box as="ul" mt={2} pl={5} color="origem.texto">
          <li>Cadastro: nome, e-mail, telefone, CPF e endereço.</li>
          <li>Artesãos: documentos de identificação, fotos do trabalho e dados bancários para repasse.</li>
          <li>Navegação: páginas visitadas, dispositivo e endereço IP.</li>
        </Box>
      </>
    ),
  },
  {
    id: "finalidade",
    titulo: "2. Finalidade",
    conteudo: (
      <Text color="origem.texto">
        Usamos seus dados para processar pedidos, realizar entregas, fazer a curadoria de
        artesãos, prevenir fraudes, enviar comunicações que você autorizou e melhorar a
        plataforma.
      </Text>
    ),
  },
  {
    id: "uso-e-armazenamento",
    titulo: "3. Uso e armazenamento",
    conteudo: (
      <Text color="origem.texto">
        Os dados ficam armazenados em servidores seguros no Brasil pelo tempo necessário para
        cumprir as finalidades acima e obrigações legais.
      </Text>
    ),
  },
  {
    id: "compartilhamento",
    titulo: "4. Compartilhamento",
    conteudo: (
      <Text color="origem.texto">
        Compartilhamos dados apenas quando necessário: com o artesão responsável pelo seu pedido
        (nome e endereço de entrega), com transportadoras e com o intermediador de pagamentos.
        Nunca vendemos seus dados.
      </Text>
    ),
  },
  {
    id: "direitos-do-usuario",
    titulo: "5. Direitos do usuário",
    conteudo: (
      <>
        <Text color="origem.texto">Você pode, a qualquer momento:</Text>
        <Box as="ul" mt={2} pl={5} color="origem.texto">
          <li>Confirmar a existência de tratamento e acessar seus dados.</li>
          <li>Corrigir dados incompletos ou desatualizados.</li>
          <li>Solicitar anonimização, portabilidade ou exclusão.</li>
          <li>Revogar consentimentos, como o da newsletter.</li>
        </Box>
      </>
    ),
  },
  {
    id: "seguranca",
    titulo: "6. Segurança",
    conteudo: (
      <Text color="origem.texto">
        Adotamos criptografia, controle de acesso e monitoramento para proteger seus dados
        contra acessos não autorizados.
      </Text>
    ),
  },
  {
    id: "cookies",
    titulo: "7. Cookies",
    conteudo: (
      <Text color="origem.texto">
        Usamos cookies para manter sua sessão e entender o uso da plataforma. Saiba mais na{" "}
        <Link asChild color="origem.laranja" fontWeight="medium">
          <NextLink href="/institucional/politica-de-cookies">Política de Cookies</NextLink>
        </Link>
        .
      </Text>
    ),
  },
  {
    id: "terceiros",
    titulo: "8. Terceiros",
    conteudo: (
      <Text color="origem.texto">
        Links para sites de terceiros, como redes sociais, seguem as políticas desses serviços.
      </Text>
    ),
  },
  {
    id: "contato-do-encarregado",
    titulo: "9. Contato do encarregado (DPO)",
    conteudo: <Text color="origem.texto">Encarregado de dados: privacidade@origem.com.</Text>,
  },
  {
    id: "como-solicitar",
    titulo: "10. Como solicitar informações ou alterações",
    conteudo: (
      <Text color="origem.texto">
        Acesse Minha conta &gt; Privacidade ou envie um e-mail ao encarregado. Respondemos em até
        15 dias.
      </Text>
    ),
  },
]

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalPageLayout
      breadcrumbAtual="Política de privacidade"
      titulo="Política de privacidade"
      atualizadoEm="25 de setembro de 2026"
      intro="Esta política explica como o Origem coleta, usa, armazena e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)."
      secoes={SECOES}
    />
  )
}
