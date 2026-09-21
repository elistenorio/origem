import { Flex } from "@chakra-ui/react"
import { TopNav } from "@/components/layout/TopNav"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minH="100vh">
      <TopNav />
      <Flex as="main" direction="column" flex="1">
        {children}
      </Flex>
    </Flex>
  )
}