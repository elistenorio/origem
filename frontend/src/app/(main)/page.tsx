import { Stack } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { HomeBanner } from "@/components/home/HomeBanner"
import { CategoryChips } from "@/components/home/CategoryChips"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { FeaturedArtisans } from "@/components/home/FeaturedArtisans"

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
