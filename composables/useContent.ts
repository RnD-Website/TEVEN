/**
 * Content layer.
 * Returns the bundled TEVEN content, merged with Sanity documents when a
 * Sanity project ID is configured (NUXT_PUBLIC_SANITY_PROJECT_ID).
 * Fetched at build time during `nuxi generate`, so the static site ships
 * with CMS content baked in.
 */
import { createClient, type SanityClient } from '@sanity/client'
import * as site from '~/data/site'

let client: SanityClient | null = null

export function useSanityClient() {
  const config = useRuntimeConfig().public
  if (!config.sanityProjectId) return null
  if (!client) {
    client = createClient({
      projectId: config.sanityProjectId as string,
      dataset: config.sanityDataset as string,
      apiVersion: config.sanityApiVersion as string,
      useCdn: true
    })
  }
  return client
}

const QUERY = `{
  "products": *[_type == "product"] | order(order asc){ "slug": slug.current, name, origin, notes, description, color, accent, ink, caffeine, "image": image.asset->url },
  "articles": *[_type == "journalArticle"] | order(date desc){ "slug": slug.current, title, category, date, excerpt, "image": image.asset->url },
  "heroSlides": *[_type == "featuredStory"] | order(order asc){ "id": slug.current, thumbTitle, title, text, cta, "image": image.asset->url, "thumb": image.asset->url },
  "origins": *[_type == "teaOrigin"] | order(order asc){ "slug": slug.current, country, tea, color, "image": image.asset->url },
  "sustainability": *[_type == "sustainability"][0]{ label, titleLines, text, pillars }
}`

export async function useSiteContent() {
  const sanity = useSanityClient()
  const { data } = await useAsyncData('site-content', async () => {
    // Nuxt requires a non-null value: {} means "no CMS content, use bundled data"
    if (!sanity) return {}
    try {
      return (await sanity.fetch(QUERY)) ?? {}
    } catch (e) {
      console.warn('[TEVEN] Sanity fetch failed, using bundled content.', e)
      return {}
    }
  })

  const cms = (data.value ?? {}) as Record<string, any>
  const pick = <T>(key: string, fallback: T): T => {
    const v = cms[key]
    if (Array.isArray(v)) return (v.length ? v : fallback) as T
    return (v ?? fallback) as T
  }

  return {
    ...site,
    products: pick('products', site.products),
    articles: pick('articles', site.articles),
    heroSlides: pick('heroSlides', site.heroSlides),
    origins: pick('origins', site.origins),
    sustainability: { ...site.sustainability, ...(cms.sustainability ?? {}) }
  }
}
