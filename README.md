# TEVEN — The art of tea

Premium tea brand website, recreated from the Delta Cafés homepage structure and motion system and rebuilt for TEVEN.

**Stack:** Nuxt 3 (SSG) · Vue 3 · GSAP + ScrollTrigger · Lenis 1.3.1 · Sanity · Element Plus · Vercel · PWA

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # static build → .output/public
npx serve .output/public
```

Requires Node 18.18+ (Node 20/22 recommended).

## Deploy to Vercel

1. Push this folder to a Git repository and import it in Vercel. `vercel.json` sets the build to `npm run generate` and the output to `.output/public`.
2. Add environment variables from `.env.example` in **Vercel → Settings → Environment Variables** (all optional).

## Project structure

```
app.vue                     App shell: preloader, header, menu, page transitions, footer, quiz, cookies
nuxt.config.ts              Modules, head, runtime config (env), PWA
assets/css/                 tokens.css (design tokens) · base · typography · grid (28-col fluid grid)
plugins/
  01.motion.client.ts       Lenis 1.3.1 ⇄ GSAP ticker ⇄ ScrollTrigger sync
  03.analytics.client.ts    Consent-gated GTM / GA4 / Hotjar / Umami (+ optional Cookiebot)
composables/
  useMotion.ts              useGsapContext, revealLines, riseIn, imageReveal, parallax
  useDragTrack.ts           Draggable inertia carousel (products, journal)
  useLenis.ts · useUi.ts · useConsent.ts · useContent.ts (Sanity + fallback)
components/
  layout/                   AppHeader · MenuOverlay · LangSelector · AppPreloader · AppFooter · CookieConsent
  sections/                 One component per homepage section (see map below)
  quiz/QuizModal.vue        Functional tea quiz with personalised result
  ui/                       PillButton · RoundButton · SplitTitle · TeaPouch (SVG packaging) · TImg · TIcon · TrackScrollbar · TevenLogo
data/
  site.ts                   All homepage content (fallback when Sanity is not configured)
  pages.ts                  Inner-page content map (every nav/footer link resolves)
  images.ts                 Central image registry (Unsplash IDs) + responsive srcset helpers
pages/index.vue             Homepage
pages/[...slug].vue         Editorial inner pages: products, origins, journal, culture, legal
sanity/schemas/             Content schemas (product, teaOrigin, featuredStory, journalArticle, sustainability, brandStory)
studio/                     Sanity Studio (cd studio && npm install && npm run dev)
public/                     favicon, PWA icons, robots.txt
```

## Section map (reference → TEVEN)

| # | Section | Component | Motion |
|---|---------|-----------|--------|
| 01 | Header & navigation | `AppHeader`, `MenuOverlay`, `LangSelector` | Split pill nav around hanging badge, mega dropdown (height/stagger), full-screen menu (circle clip reveal, line stagger) |
| 02/04 | Hero + featured story carousel | `HeroSection` | Preloader → masked headline, 3 auto slides with progress thumbnails, clip-path image wipes, scroll parallax |
| 03 | Brand storytelling | Hero card cluster ("Rooted in nature…") + orbit captions | Card stagger, hover lift |
| 05 | Tea collection | `ProductCarousel` | Drag/inertia track, prev/next, custom scrollbar, pouch hover |
| 06 | Heritage | `HeritageSection` | Masked title, pinned orbit gallery (photos rotate on rings with scroll, click-to-centre) |
| 07 | Journey of tea | `JourneySection` | Pinned + scrubbed path drawing, 4 stage nodes, stage tabs jump via Lenis |
| 08 | Tea Journal showcase | `MagazineMarquee` | Two opposite marquees accelerated by scroll velocity |
| 09 | Discovery Centre / Craft Academy | `CultureSection` | Clip-path image reveals, parallax, vertical rule draw |
| 10/11 | Origins showcase + quiz | `OriginsQuizSection`, `QuizModal` | Pinned 3D cylinder of 18 origin pouches (depth scale/blur), functional quiz |
| 12 | TEVEN Journal | `JournalSection` | Category filters, draggable cards, scrollbar |
| 13 | Sustainability | `SustainabilitySection` | Botanical line art draws on scroll, edge photo parallax |
| 14 | Final featured story | `FinalFeature` | Sticky full-bleed image, inset-to-full clip, scale |
| 15 | Footer | `AppFooter` | Blurred panel overlaying the final story, mobile accordions |

## CMS (Sanity)

Set `NUXT_PUBLIC_SANITY_PROJECT_ID` (and dataset) to pull products, featured stories, origins, journal articles and sustainability copy at build time. Without it, the site uses `data/site.ts`. Studio lives in `/studio`.

## Analytics & consent

- GTM, GA4, Hotjar and Umami are injected **only after** the visitor accepts analytics cookies; Google Consent Mode v2 defaults to denied.
- Built-in Cookie Control banner + preferences dialog (Element Plus switches). Setting `NUXT_PUBLIC_COOKIEBOT_ID` loads Cookiebot instead and syncs its consent.
- No IDs are committed — configure them via environment variables.

## Notes on the requested stack

- **Element UI → Element Plus.** Element UI only supports Vue 2; Element Plus is its official Vue 3 successor and is used for the quiz progress bar and cookie switches. All visual design stays custom.
- **Onsen UI is not included.** It would add a second component system (which the brief also asks to avoid) and Nuxt already covers the mobile behaviour (touch carousels, mobile menu, PWA). It can be added later for a native-style mobile app shell if needed.
- **Photography** is free-licensed Unsplash imagery served from the Unsplash CDN (swap IDs in `data/images.ts` or upload to Sanity). **Packaging** is drawn in SVG (`TeaPouch.vue`) so every tea has consistent, on-brand packs.
- **Fonts:** Barlow Condensed (condensed display caps), Fraunces (editorial serif), Manrope (sans) via Google Fonts.
- Language selector sets the active language and `<html lang>`; content translations can be added via Sanity or `@nuxtjs/i18n`.
- Legal pages contain placeholders — replace with reviewed copy before launch.

## Deploying on Vercel

Import the repository with the **Root Directory left empty** (repository root) and the **Nuxt** framework preset. `vercel.json` sets the build command (`npm run generate`) and output directory (`.output/public`). Do not set the root to `studio/`: that folder is the separate Sanity Studio app.
