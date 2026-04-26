import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { Language, ContentItem } from '@/lib/content'

export interface ArticleLink {
  url: string
  title: string
}

export type ModuleLinkMap = Record<string, ArticleLink | null>

interface ArticleWithType extends ContentItem {
  contentType: string
}

// Module sub-field mapping: moduleKey -> { field, nameKey }
const MODULE_FIELDS: Record<string, { field: string; nameKey: string }> = {
  slimeRngCodes: { field: 'redeemSteps', nameKey: 'title' },
  slimeRngBeginnerGuide: { field: 'steps', nameKey: 'title' },
  slimeRngTierList: { field: 'tiers', nameKey: 'tier' },
  slimeRngSlimeCollection: { field: 'slimes', nameKey: 'name' },
  slimeRngRebirthGuide: { field: 'items', nameKey: 'title' },
  slimeRngGoopGuide: { field: 'items', nameKey: 'question' },
  slimeRngLuckGuide: { field: 'items', nameKey: 'title' },
  slimeRngHugeSlimesGuide: { field: 'items', nameKey: 'name' },
  slimeRngVoidSlimeGuide: { field: 'items', nameKey: 'title' },
  slimeRngZoneMap: { field: 'items', nameKey: 'name' },
  slimeRngCoinsFarmingGuide: { field: 'items', nameKey: 'title' },
  slimeRngUpgradesGuide: { field: 'items', nameKey: 'upgrade' },
  slimeRngFruitsAndXpGuide: { field: 'items', nameKey: 'item' },
  slimeRngDiceAndRollSpeedGuide: { field: 'items', nameKey: 'question' },
  slimeRngTradingValues: { field: 'items', nameKey: 'slime' },
  slimeRngUpdatesAndPatchNotes: { field: 'items', nameKey: 'title' },
}

// Extra semantic keywords per module to boost matching for h2 titles
// These supplement the module title text when matching against articles
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  slimeRngCodes: ['codes', 'rewards', 'ultra luck', 'coins', 'rare dice', 'redeem'],
  slimeRngBeginnerGuide: ['beginner', 'how to play', 'progression', 'roll speed', 'auto roll', 'upgrades'],
  slimeRngTierList: ['tier list', 'best slime', 'rarity', 'void slime', 'rare slimes', 'slime list'],
  slimeRngSlimeCollection: ['slime list', 'collection', 'rare slimes', 'shiny slimes', 'rarity', 'squad'],
  slimeRngRebirthGuide: ['rebirth', 'requirements', 'goop', 'permanent luck', 'multiplier', 'when to rebirth'],
  slimeRngGoopGuide: ['goop', 'rebirth requirements', 'coins', '10m', 'farm', 'mid game'],
  slimeRngLuckGuide: ['luck', 'luck boost', 'infinite luck', 'roll chance', 'rare slimes', 'boosters'],
  slimeRngHugeSlimesGuide: ['huge', 'shiny', 'rare slimes', 'rarest slime', 'dangerous slimes', 'variants'],
  slimeRngVoidSlimeGuide: ['void slime', 'rarest slime', 'mythic', 'roll odds', 'rare slimes', 'late game'],
  slimeRngZoneMap: ['zones', 'world progression', 'unlock', 'coins', 'enemy hp', 'area'],
  slimeRngCoinsFarmingGuide: ['coins', 'farm coins', 'money guide', 'make money', 'currency', 'afk'],
  slimeRngUpgradesGuide: ['upgrades', 'auto roll', 'roll speed', 'enemy count', 'slime slots', 'progression'],
  slimeRngFruitsAndXpGuide: ['xp', 'fruits', 'apples', 'leveling', 'progression', 'feed'],
  slimeRngDiceAndRollSpeedGuide: ['dice', 'roll speed', 'auto roll', 'best roll method', 'roll chance', 'boost'],
  slimeRngTradingValues: ['trading', 'values', 'best slime', 'huge spike', 'huge rocky', 'market'],
  slimeRngUpdatesAndPatchNotes: ['updates', 'patch notes', 'codes', 'rewards', 'zone 8', 'void slime'],
}

const FILLER_WORDS = ['slime', 'rng', '2026', '2025', 'complete', 'the', 'and', 'for', 'how', 'with', 'our', 'this', 'your', 'all', 'from', 'learn', 'master']

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !FILLER_WORDS.includes(w))
}

function matchScore(queryText: string, article: ArticleWithType, extraKeywords?: string[]): number {
  const normalizedQuery = normalize(queryText)
  const normalizedTitle = normalize(article.frontmatter.title)
  const normalizedDesc = normalize(article.frontmatter.description || '')
  const normalizedSlug = article.slug.replace(/-/g, ' ').toLowerCase()

  let score = 0

  // Exact phrase match in title (stripped of "Slime RNG")
  const strippedQuery = normalizedQuery.replace(/slime rng\s*/g, '').trim()
  const strippedTitle = normalizedTitle.replace(/slime rng\s*/g, '').trim()
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20
    if (normalizedDesc.includes(token)) score += 5
    if (normalizedSlug.includes(token)) score += 15
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw)
      if (normalizedTitle.includes(normalizedKw)) score += 15
      if (normalizedDesc.includes(normalizedKw)) score += 5
      if (normalizedSlug.includes(normalizedKw)) score += 10
    }
  }

  return score
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  extraKeywords?: string[],
  threshold = 20,
  localePrefix = '',
): ArticleLink | null {
  let bestScore = 0
  let bestArticle: ArticleWithType | null = null

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords)
    if (score > bestScore) {
      bestScore = score
      bestArticle = article
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: `/${localePrefix}${bestArticle.contentType}/${bestArticle.slug}`,
      title: bestArticle.frontmatter.title,
    }
  }

  return null
}

export async function buildModuleLinkMap(locale: Language): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = []
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    for (const item of items) {
      allArticles.push({ ...item, contentType })
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import('../locales/en.json')).default as any

  const linkMap: ModuleLinkMap = {}
  const localePrefix = locale === 'en' ? '' : `${locale}/`

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfig] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey]
    if (!moduleData) continue

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string
    if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || []
      linkMap[moduleKey] = findBestMatch(moduleTitle, allArticles, extraKw, 15, localePrefix)
    }

    // Match sub-items
    const subItems = moduleData[fieldConfig.field] as any[]
    if (Array.isArray(subItems)) {
      for (let i = 0; i < subItems.length; i++) {
        const itemName = subItems[i]?.[fieldConfig.nameKey] as string
        if (itemName) {
          const key = `${moduleKey}::${fieldConfig.field}::${i}`
          linkMap[key] = findBestMatch(itemName, allArticles, undefined, 20, localePrefix)
        }
      }
    }
  }

  return linkMap
}
