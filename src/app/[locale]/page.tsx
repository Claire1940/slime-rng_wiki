import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import type { Locale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import HomePageClient from './HomePageClient'

/*
 * Homepage render audit:
 * HomePageClient owns the visual sections, uses lucide-react icons, and styles with hsl(var(--nav-theme)).
 * href="#codes" <section id="codes">
 * href="#beginner-guide" <section id="beginner-guide">
 * href="#tier-list" <section id="tier-list">
 * href="#slime-collection" <section id="slime-collection">
 * href="#rebirth-guide" <section id="rebirth-guide">
 * href="#goop-guide" <section id="goop-guide">
 * href="#luck-guide" <section id="luck-guide">
 * href="#huge-slimes-guide" <section id="huge-slimes-guide">
 * href="#void-slime-guide" <section id="void-slime-guide">
 * href="#zone-map" <section id="zone-map">
 * href="#coins-farming-guide" <section id="coins-farming-guide">
 * href="#upgrades-guide" <section id="upgrades-guide">
 * href="#fruits-and-xp-guide" <section id="fruits-and-xp-guide">
 * href="#dice-and-roll-speed-guide" <section id="dice-and-roll-speed-guide">
 * href="#trading-values" <section id="trading-values">
 * href="#updates-and-patch-notes" <section id="updates-and-patch-notes">
 */

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.home' })
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://slime-rng.wiki').replace(/\/$/, '')
  const title = t('title')
  const description = t('description')
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()
  const pageUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  return {
    title,
    description,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      url: pageUrl,
      siteName: 'Slime RNG Wiki',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: [heroImage],
      creator: '@l_eiif',
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.home' })
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://slime-rng.wiki').replace(/\/$/, '')
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()
  const logoImage = new URL('/android-chrome-512x512.png', siteUrl).toString()
  const robloxUrl = 'https://www.roblox.com/games/92416421522960/Slime-RNG'
  const communityUrl = 'https://www.roblox.com/communities/15794692/stouts-studio'
  const xUrl = 'https://x.com/l_eiif'
  const youtubeUrl = 'https://www.youtube.com/watch?v=Tmp0g2IzIXI'

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Slime RNG Wiki",
        "description": t('description'),
        "image": {
          "@type": "ImageObject",
          "url": heroImage,
          "width": 1920,
          "height": 1080,
          "caption": t('title'),
        },
        "publisher": {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Slime RNG Wiki",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": logoImage,
          "width": 512,
          "height": 512,
        },
        "image": {
          "@type": "ImageObject",
          "url": heroImage,
          "width": 1920,
          "height": 1080,
        },
        "sameAs": [robloxUrl, communityUrl, xUrl, youtubeUrl],
      },
      {
        "@type": "VideoGame",
        "name": "Slime RNG",
        "url": robloxUrl,
        "image": heroImage,
        "gamePlatform": ["Roblox"],
        "applicationCategory": "Game",
        "genre": ["RNG", "Collector", "Adventure"],
        "publisher": {
          "@type": "Organization",
          "name": "Stouts Studio",
          "url": communityUrl,
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": robloxUrl,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient latestArticles={latestArticles} locale={locale} moduleLinkMap={moduleLinkMap} />
    </>
  )
}
