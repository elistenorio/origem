import { Box, Flex } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { NewsletterIntro } from "@/components/newsletter/NewsletterIntro"
import { NewsletterForm } from "@/components/newsletter/NewsletterForm"

export default function NewsletterPage() {
  return (
    <PageContainer>
      <PageHeader caminho="Home / Nossa Newsletter" titulo="Nossa Newsletter" />
      <Flex gap="10" direction={{ base: "column", lg: "row" }} align="flex-start">
        <NewsletterIntro />
        <Box w={{ base: "full", lg: "460px" }} flexShrink={0}>
          <NewsletterForm />
        </Box>
      </Flex>
    </PageContainer>
  )
}
