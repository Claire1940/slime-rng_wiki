'use client'

import { useEffect, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
  Coins,
  Eye,
  ExternalLink,
  Gamepad2,
  Gem,
  MapPinned,
  Package,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import enMessages from '@/locales/en.json'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  locale: string
}

export default function HomePageClient({ latestArticles, locale }: HomePageClientProps) {
  const localeMessages = useMessages() as any
  const t = localeMessages?.hero?.title === enMessages.hero.title ? localeMessages : enMessages

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://www.roblox.com/games/92416421522960/Slime-RNG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-[hsl(var(--primary-foreground))] rounded-lg font-semibold text-lg transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.roblox.com/communities/15794692/stouts-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="Tmp0g2IzIXI"
              title="I GAMBLED to get the most DANGEROUS slimes in Roblox Slime RNG"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* Tools Grid - 12 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <a
              href="#codes"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('codes')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '0ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[0].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>

            <a
              href="#beginner-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('beginner-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '50ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[1].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>

            <a
              href="#tier-list"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('tier-list')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[2].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>

            <a
              href="#slime-collection"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('slime-collection')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '150ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[3].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>

            <a
              href="#rebirth-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('rebirth-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[4].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[4].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>

            <a
              href="#goop-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('goop-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '250ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[5].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[5].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>

            <a
              href="#luck-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('luck-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '300ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[6].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[6].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>

            <a
              href="#huge-slimes-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('huge-slimes-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '350ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[7].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[7].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>

            <a
              href="#void-slime-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('void-slime-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '400ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[8].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[8].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[8].description}</p>
            </a>

            <a
              href="#zone-map"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('zone-map')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '450ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[9].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[9].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[9].description}</p>
            </a>

            <a
              href="#coins-farming-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('coins-farming-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '500ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[10].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[10].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[10].description}</p>
            </a>

            <a
              href="#upgrades-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('upgrades-guide')
              }}
              className="scroll-reveal group p-6 rounded-xl border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 cursor-pointer text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: '550ms' }}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <DynamicIcon
                  name={t.tools.cards[11].icon}
                  className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[11].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[11].description}</p>
            </a>
          </div>
        </div>
      </section>

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Slime RNG Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ClipboardCheck className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngCodes.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngCodes.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngCodes.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
            <div className="scroll-reveal space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold">Working Slime RNG Codes</h3>
                <span className="shrink-0 text-xs px-3 py-1 rounded-full
                                 bg-[hsl(var(--nav-theme)/0.1)]
                                 border border-[hsl(var(--nav-theme)/0.3)]
                                 text-[hsl(var(--nav-theme-light))]">
                  {t.modules.slimeRngCodes.workingUpdated}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.modules.slimeRngCodes.workingCodes.map((code: any) => (
                  <div key={code.code} className="p-5 rounded-xl border border-border bg-card
                                                  hover:border-[hsl(var(--nav-theme)/0.5)]
                                                  transition-colors">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <code className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                        {code.code}
                      </code>
                      <span className="text-xs px-2 py-1 rounded-full
                                       bg-[hsl(var(--nav-theme)/0.1)]
                                       border border-[hsl(var(--nav-theme)/0.3)]">
                        {code.status}
                      </span>
                    </div>
                    <p className="font-semibold mb-2">{code.reward}</p>
                    <p className="text-sm text-muted-foreground">{code.bestFor}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-reveal space-y-4">
              <div className="p-5 rounded-xl border border-border bg-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg">How to Redeem Slime RNG Codes</h3>
                </div>
                <div className="space-y-4">
                  {t.modules.slimeRngCodes.redeemSteps.map((step: any, index: number) => (
                    <div key={step.title} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                                       bg-[hsl(var(--nav-theme)/0.16)]
                                       text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-white/5">
                <h3 className="font-bold mb-3">Expired Slime RNG Codes</h3>
                <div className="flex flex-wrap gap-2">
                  {t.modules.slimeRngCodes.expiredCodes.map((code: string) => (
                    <code key={code} className="px-3 py-1 rounded-lg bg-background border border-border text-sm">
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[hsl(var(--nav-theme)/0.3)]
                              bg-[hsl(var(--nav-theme)/0.05)]">
                <h3 className="font-bold mb-3">Slime RNG Code Tips</h3>
                <ul className="space-y-2">
                  {t.modules.slimeRngCodes.tips.map((tip: string) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Slime RNG Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngBeginnerGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngBeginnerGuide.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4 mb-8">
            {t.modules.slimeRngBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={step.title} className="grid grid-cols-[auto_1fr] gap-4 p-5 rounded-xl
                                               bg-card border border-border
                                               hover:border-[hsl(var(--nav-theme)/0.5)]
                                               transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full
                                bg-[hsl(var(--nav-theme)/0.16)]
                                border border-[hsl(var(--nav-theme)/0.35)]">
                  <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)]
                                     border border-[hsl(var(--nav-theme)/0.3)]">
                      {step.priority}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-1">
                    {step.goal}
                  </p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal p-6 rounded-xl border border-[hsl(var(--nav-theme)/0.3)]
                          bg-[hsl(var(--nav-theme)/0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Slime RNG Beginner Priorities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.modules.slimeRngBeginnerGuide.quickTips.map((tip: string) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module 3: Slime RNG Tier List */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngTierList.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngTierList.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {t.modules.slimeRngTierList.tiers.map((tier: any) => (
              <div key={tier.tier} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl
                                  bg-[hsl(var(--nav-theme)/0.16)]
                                  border border-[hsl(var(--nav-theme)/0.35)]
                                  text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {tier.tier}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Slime RNG {tier.tier} Tier</h3>
                    <p className="text-sm text-muted-foreground">{tier.summary}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tier.slimes.map((slime: any) => (
                    <div key={slime.name} className="p-4 rounded-lg border border-border bg-white/5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="font-bold text-lg">{slime.name}</h4>
                        <span className="text-xs px-2 py-1 rounded-full
                                         bg-[hsl(var(--nav-theme)/0.1)]
                                         border border-[hsl(var(--nav-theme)/0.3)]">
                          {slime.rarity}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div className="rounded-lg bg-background/70 border border-border p-2">
                          <p className="text-muted-foreground">Damage</p>
                          <p className="font-semibold">{slime.damage}</p>
                        </div>
                        <div className="rounded-lg bg-background/70 border border-border p-2">
                          <p className="text-muted-foreground">Speed</p>
                          <p className="font-semibold">{slime.speed}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-1">
                        {slime.role}
                      </p>
                      <p className="text-sm text-muted-foreground">{slime.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Slime RNG Slime Collection */}
      <section id="slime-collection" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngSlimeCollection.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngSlimeCollection.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngSlimeCollection.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.slimeRngSlimeCollection.slimes.map((slime: any) => (
              <div key={slime.name} className="p-5 rounded-xl border border-border bg-card
                                              hover:border-[hsl(var(--nav-theme)/0.5)]
                                              transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{slime.name}</h3>
                    <p className="text-sm text-[hsl(var(--nav-theme-light))]">{slime.role}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full
                                   bg-[hsl(var(--nav-theme)/0.1)]
                                   border border-[hsl(var(--nav-theme)/0.3)]">
                    {slime.rarity}
                  </span>
                </div>
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  {slime.stage}
                </p>
                <p className="text-sm text-muted-foreground mb-3">{slime.description}</p>
                <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--nav-theme)/0.25)]
                                bg-[hsl(var(--nav-theme)/0.05)] p-3">
                  <Package className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                  <p className="text-sm">{slime.recommendedUse}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal p-6 rounded-xl border border-[hsl(var(--nav-theme)/0.3)]
                          bg-[hsl(var(--nav-theme)/0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Slime RNG Collection Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {t.modules.slimeRngSlimeCollection.collectionTips.map((tip: string) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 5: Slime RNG Rebirth Guide */}
      <section id="rebirth-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngRebirthGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngRebirthGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngRebirthGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngRebirthGuide.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.75fr] gap-6">
            <div className="scroll-reveal space-y-4">
              {t.modules.slimeRngRebirthGuide.items.map((step: any) => (
                <div key={step.step} className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-border
                                                bg-card p-5 hover:border-[hsl(var(--nav-theme)/0.5)]
                                                transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full
                                  bg-[hsl(var(--nav-theme)/0.16)]
                                  border border-[hsl(var(--nav-theme)/0.35)]">
                    <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {step.keyPoints.map((point: string) => (
                        <div key={point} className="flex items-start gap-2 rounded-lg border border-border
                                                    bg-white/5 p-3 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="scroll-reveal lg:sticky lg:top-24 h-fit rounded-xl border border-[hsl(var(--nav-theme)/0.3)]
                            bg-[hsl(var(--nav-theme)/0.05)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-lg">Slime RNG Rebirth Timing</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                {t.modules.slimeRngRebirthGuide.strategyNote}
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="rounded-lg border border-border bg-background/70 p-4">
                  <p className="text-muted-foreground">Reset</p>
                  <p className="font-semibold">Coins and zone access</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-4">
                  <p className="text-muted-foreground">Keep</p>
                  <p className="font-semibold">Slimes, fruits, consumables, and upgrades</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-4">
                  <p className="text-muted-foreground">Gain</p>
                  <p className="font-semibold">Permanent Slime RNG luck multiplier growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: Slime RNG Goop Guide */}
      <section id="goop-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Package className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngGoopGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngGoopGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngGoopGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngGoopGuide.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6">
            <div className="scroll-reveal space-y-3">
              {t.modules.slimeRngGoopGuide.items.map((item: any) => (
                <details key={item.question} className="group rounded-xl border border-border bg-card p-5
                                                        open:border-[hsl(var(--nav-theme)/0.45)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-bold text-lg">{item.question}</span>
                    <ArrowRight className="w-5 h-5 text-[hsl(var(--nav-theme-light))]
                                           transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-muted-foreground">{item.answer}</p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                    {item.details.map((detail: string) => (
                      <div key={detail} className="flex items-start gap-2 rounded-lg border border-border
                                                  bg-white/5 p-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>

            <div className="scroll-reveal h-fit rounded-xl border border-[hsl(var(--nav-theme)/0.3)]
                            bg-[hsl(var(--nav-theme)/0.05)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-lg">{t.modules.slimeRngGoopGuide.checklistTitle}</h3>
              </div>
              <div className="space-y-3">
                {t.modules.slimeRngGoopGuide.checklist.map((item: string) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-border
                                             bg-background/70 p-4 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 7: Slime RNG Luck Guide */}
      <section id="luck-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Eye className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngLuckGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngLuckGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngLuckGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngLuckGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.modules.slimeRngLuckGuide.items.map((step: any) => (
              <div key={step.step} className="rounded-xl border border-border bg-card p-5
                                             hover:border-[hsl(var(--nav-theme)/0.5)]
                                             transition-colors">
                <div className="mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full
                                   bg-[hsl(var(--nav-theme)/0.16)]
                                   border border-[hsl(var(--nav-theme)/0.35)]
                                   text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                <p className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)]
                              bg-[hsl(var(--nav-theme)/0.05)] p-3 text-sm">
                  {step.bestFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Slime RNG Huge Slimes Guide */}
      <section id="huge-slimes-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngHugeSlimesGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngHugeSlimesGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngHugeSlimesGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngHugeSlimesGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.slimeRngHugeSlimesGuide.items.map((variant: any) => (
              <div key={variant.name} className="rounded-xl border border-border bg-card p-5
                                                hover:border-[hsl(var(--nav-theme)/0.5)]
                                                transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{variant.name}</h3>
                    <p className="text-sm text-[hsl(var(--nav-theme-light))]">{variant.role}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full
                                   bg-[hsl(var(--nav-theme)/0.1)]
                                   border border-[hsl(var(--nav-theme)/0.3)]">
                    {variant.rarity}
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-3 mb-3">
                  <p className="text-xs uppercase text-muted-foreground">Odds</p>
                  <p className="font-semibold">{variant.odds}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{variant.description}</p>
                <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--nav-theme)/0.25)]
                                bg-[hsl(var(--nav-theme)/0.05)] p-3">
                  <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                  <p className="text-sm">{variant.recommendedUse}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)]
                          bg-[hsl(var(--nav-theme)/0.05)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Slime RNG Huge Slime Priorities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {t.modules.slimeRngHugeSlimesGuide.tips.map((tip: string) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module 9: Slime RNG Void Slime Guide */}
      <section id="void-slime-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Gem className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngVoidSlimeGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngVoidSlimeGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngVoidSlimeGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngVoidSlimeGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.modules.slimeRngVoidSlimeGuide.items.map((item: any) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5
                                             hover:border-[hsl(var(--nav-theme)/0.5)]
                                             transition-colors">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg
                                  bg-[hsl(var(--nav-theme)/0.14)]
                                  border border-[hsl(var(--nav-theme)/0.3)]">
                    <Gem className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  {(item.rarity || item.tier) && (
                    <span className="text-xs px-2 py-1 rounded-full
                                     bg-[hsl(var(--nav-theme)/0.1)]
                                     border border-[hsl(var(--nav-theme)/0.3)]">
                      {[item.rarity, item.tier].filter(Boolean).join(' / ')}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.summary}</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {item.odds && (
                    <div className="rounded-lg border border-border bg-background/70 p-3">
                      <p className="text-muted-foreground">Slime RNG Roll Odds</p>
                      <p className="font-semibold">{item.odds}</p>
                    </div>
                  )}
                  {item.damage && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-border bg-background/70 p-3">
                        <p className="text-muted-foreground">Damage</p>
                        <p className="font-semibold">{item.damage}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background/70 p-3">
                        <p className="text-muted-foreground">Speed</p>
                        <p className="font-semibold">{item.speed}</p>
                      </div>
                    </div>
                  )}
                  {(item.role || item.focus || item.powerPosition) && (
                    <div className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)]
                                    bg-[hsl(var(--nav-theme)/0.05)] p-3">
                      <p className="font-semibold text-[hsl(var(--nav-theme-light))]">
                        {item.role || item.focus || item.powerPosition}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Slime RNG Zone Map */}
      <section id="zone-map" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <MapPinned className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngZoneMap.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngZoneMap.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngZoneMap.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngZoneMap.intro}
            </p>
          </div>

          <div className="scroll-reveal relative">
            <div className="absolute left-5 top-0 hidden h-full w-px bg-border md:block" />
            <div className="space-y-4">
              {t.modules.slimeRngZoneMap.items.map((zone: any) => (
                <div key={zone.zone} className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
                  <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full
                                  bg-[hsl(var(--nav-theme))]
                                  text-[hsl(var(--primary-foreground))]
                                  font-bold">
                    {zone.zone}
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5
                                  hover:border-[hsl(var(--nav-theme)/0.5)]
                                  transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm text-[hsl(var(--nav-theme-light))] font-semibold">
                          {zone.phase}
                        </p>
                        <h3 className="text-2xl font-bold">{zone.name}</h3>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full
                                       bg-[hsl(var(--nav-theme)/0.1)]
                                       border border-[hsl(var(--nav-theme)/0.3)]">
                        Unlock: {zone.unlock}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="rounded-lg border border-border bg-background/70 p-3">
                        <p className="text-muted-foreground text-sm">Enemy HP</p>
                        <p className="font-semibold">{zone.enemyHp}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background/70 p-3">
                        <p className="text-muted-foreground text-sm">Coin Yield</p>
                        <p className="font-semibold">{zone.coinYield}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{zone.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module 11: Slime RNG Coins Farming Guide */}
      <section id="coins-farming-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Coins className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngCoinsFarmingGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngCoinsFarmingGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngCoinsFarmingGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngCoinsFarmingGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.slimeRngCoinsFarmingGuide.items.map((step: any) => (
              <div key={step.step} className="grid grid-cols-1 lg:grid-cols-[auto_1fr_0.9fr] gap-4
                                             rounded-xl border border-border bg-card p-5
                                             hover:border-[hsl(var(--nav-theme)/0.5)]
                                             transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full
                                bg-[hsl(var(--nav-theme)/0.16)]
                                border border-[hsl(var(--nav-theme)/0.35)]">
                  <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="font-semibold text-[hsl(var(--nav-theme-light))] mb-2">
                    {step.goal}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.why}</p>
                </div>
                <div className="space-y-2">
                  {step.actions.map((action: string) => (
                    <div key={action} className="flex items-start gap-2 rounded-lg border border-border
                                                bg-white/5 p-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Slime RNG Upgrades Guide */}
      <section id="upgrades-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Settings className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.slimeRngUpgradesGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.modules.slimeRngUpgradesGuide.title}
            </h2>
            <p className="text-[hsl(var(--nav-theme-light))] font-semibold mb-3">
              {t.modules.slimeRngUpgradesGuide.subtitle}
            </p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.slimeRngUpgradesGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal hidden md:block overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-left">
              <thead className="bg-[hsl(var(--nav-theme)/0.08)]">
                <tr className="border-b border-border">
                  <th className="p-4 font-semibold">Slime RNG Upgrade</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Best Timing</th>
                  <th className="p-4 font-semibold">Effect</th>
                  <th className="p-4 font-semibold">Use Case</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.slimeRngUpgradesGuide.items.map((upgrade: any) => (
                  <tr key={upgrade.upgrade} className="border-b border-border last:border-b-0
                                                       hover:bg-[hsl(var(--nav-theme)/0.04)]">
                    <td className="p-4 font-bold">{upgrade.upgrade}</td>
                    <td className="p-4">
                      <span className="inline-flex min-w-10 justify-center rounded-full px-3 py-1 text-sm font-bold
                                       bg-[hsl(var(--nav-theme)/0.12)]
                                       border border-[hsl(var(--nav-theme)/0.3)]
                                       text-[hsl(var(--nav-theme-light))]">
                        {upgrade.priority}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{upgrade.bestTiming}</td>
                    <td className="p-4 text-sm text-muted-foreground">{upgrade.effect}</td>
                    <td className="p-4 text-sm text-muted-foreground">{upgrade.useCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:hidden">
            {t.modules.slimeRngUpgradesGuide.items.map((upgrade: any) => (
              <div key={upgrade.upgrade} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-xl font-bold">{upgrade.upgrade}</h3>
                  <span className="shrink-0 rounded-full px-3 py-1 text-sm font-bold
                                   bg-[hsl(var(--nav-theme)/0.12)]
                                   border border-[hsl(var(--nav-theme)/0.3)]
                                   text-[hsl(var(--nav-theme-light))]">
                    {upgrade.priority}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-2">
                  {upgrade.bestTiming}
                </p>
                <p className="text-sm text-muted-foreground mb-3">{upgrade.effect}</p>
                <p className="rounded-lg border border-[hsl(var(--nav-theme)/0.25)]
                              bg-[hsl(var(--nav-theme)/0.05)] p-3 text-sm">
                  {upgrade.useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/92416421522960/Slime-RNG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/l_eiif"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.creatorX}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/15794692/stouts-studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=Tmp0g2IzIXI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtubeVideo}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
