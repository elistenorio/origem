import { Flex } from "@chakra-ui/react"
import { TopNav } from "@/components/layout/TopNav"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minH="100vh">
      <TopNav />
      <Flex
        as="main"
        flex="1"
        align="center"
        justify="center"
        p="4"
        backgroundImage="url('/images/auth-mosaic.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
      >
        {children}
      </Flex>
    </Flex>
  )
}