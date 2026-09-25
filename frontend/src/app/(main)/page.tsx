import { Stack } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { HomeBanner } from "@/components/inicio/HomeBanner"
import { CategoryChips } from "@/components/inicio/CategoryChips"
import { FeaturedProducts } from "@/components/inicio/FeaturedProducts"
import { FeaturedArtisans } from "@/components/inicio/FeaturedArtisans"

export default function HomePage() {
  return (
    <PageContainer py="4">
      <Stack gap="12">
        <HomeBanner />
        <CategoryChips />
        <FeaturedProducts />
        <FeaturedArtisans />
      </Stack>
    </PageContainer>
  )
}
