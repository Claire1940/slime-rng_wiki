#!/usr/bin/env node

/**
 * SEO 检查脚本
 *
 * 基于 需求/09.seo检查.md 的检查清单
 * 自动检查所有可以在本地验证的 SEO 项目
 *
 * 使用方法：
 *   bun run scripts/check-seo.js
 *   bun run scripts/check-seo.js --locale en
 *   bun run scripts/check-seo.js --verbose
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 解析命令行参数
const args = process.argv.slice(2)
const locale = args.find(arg => arg.startsWith('--locale='))?.split('=')[1] || 'en'
const verbose = args.includes('--verbose')

// 检查结果统计
const results = {
  passed: [],
  warnings: [],
  errors: [],
}

function addResult(type, category, message, details = null) {
  results[type].push({ category, message, details })
}

// ============================================
// 1. 检查 robots.txt 和 sitemap.xml
// ============================================
function checkRobotsAndSitemap() {
  log('\n📋 检查 robots.txt 和 sitemap.xml...', 'cyan')

  // 检查动态 robots.ts。当前模板不再使用 public/robots.txt 静态文件。
  const staticRobotsPath = path.join(projectRoot, 'public', 'robots.txt')
  const robotsRoutePath = path.join(projectRoot, 'src', 'app', 'robots.ts')
  if (fs.existsSync(robotsRoutePath)) {
    const content = fs.readFileSync(robotsRoutePath, 'utf-8')
    if (content.includes('NEXT_PUBLIC_SITE_URL') && !fs.existsSync(staticRobotsPath)) {
      addResult('passed', 'Robots', '✓ 使用 src/app/robots.ts 动态生成 robots.txt')
    } else if (fs.existsSync(staticRobotsPath)) {
      addResult('errors', 'Robots', '✗ 不应存在 public/robots.txt 静态文件')
    } else {
      addResult('warnings', 'Robots', '⚠ robots.ts 未读取 NEXT_PUBLIC_SITE_URL')
    }
  } else {
    addResult('errors', 'Robots', '✗ src/app/robots.ts 不存在')
  }

  // 检查动态 sitemap.ts
  const sitemapRoutePath = path.join(projectRoot, 'src', 'app', 'sitemap.ts')
  if (fs.existsSync(sitemapRoutePath)) {
    const content = fs.readFileSync(sitemapRoutePath, 'utf-8')
    if (content.includes('NEXT_PUBLIC_SITE_URL')) {
      addResult('passed', 'Sitemap', '✓ 使用 src/app/sitemap.ts 动态生成 sitemap.xml')
    } else {
      addResult('warnings', 'Sitemap', '⚠ sitemap.ts 未读取 NEXT_PUBLIC_SITE_URL')
    }
  } else {
    addResult('errors', 'Sitemap', '✗ src/app/sitemap.ts 不存在')
  }
}

// ============================================
// 2. 检查翻译文件中的 SEO 元数据
// ============================================
function checkSEOMetadata() {
  log('\n🏷️  检查 SEO 元数据...', 'cyan')

  const localesDir = path.join(projectRoot, 'src', 'locales')
  const localeFile = path.join(localesDir, `${locale}.json`)

  if (!fs.existsSync(localeFile)) {
    addResult('errors', 'Metadata', `✗ 翻译文件不存在: ${locale}.json`)
    return
  }

  const translations = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))
  const seo = translations.seo?.home
  const metadataSources = [
    path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'layout.tsx'),
  ]
  const metadataContent = metadataSources
    .filter(source => fs.existsSync(source))
    .map(source => fs.readFileSync(source, 'utf-8'))
    .join('\n')
  const runtimeTitle = metadataContent.match(/const\s+title\s*=\s*['"`]([^'"`]+)['"`]/)?.[1]
  const runtimeDescription = metadataContent.match(/const\s+description\s*=\s*['"`]([^'"`]+)['"`]/)?.[1]

  if (!seo && (!runtimeTitle || !runtimeDescription)) {
    addResult('errors', 'Metadata', '✗ 缺少 seo.home 配置')
    return
  }

  // 检查 Title
  const title = runtimeTitle || seo.title
  if (title) {
    const titleLength = title.length
    if (titleLength >= 30 && titleLength <= 60) {
      addResult('passed', 'Title', `✓ Title 长度合适 (${titleLength} 字符)`)
    } else if (titleLength < 30) {
      addResult('warnings', 'Title', `⚠ Title 过短 (${titleLength} 字符，建议 30-60)`)
    } else {
      addResult('warnings', 'Title', `⚠ Title 过长 (${titleLength} 字符，建议 30-60)`)
    }
  } else {
    addResult('errors', 'Title', '✗ 缺少 Title')
  }

  // 检查 Description
  const description = runtimeDescription || seo.description
  if (description) {
    const descLength = description.length
    if (descLength >= 140 && descLength <= 160) {
      addResult('passed', 'Description', `✓ Description 长度合适 (${descLength} 字符)`)
    } else if (descLength < 140) {
      addResult('warnings', 'Description', `⚠ Description 过短 (${descLength} 字符，建议 140-160)`)
    } else {
      addResult('warnings', 'Description', `⚠ Description 过长 (${descLength} 字符，建议 140-160)`)
    }
  } else {
    addResult('errors', 'Description', '✗ 缺少 Description')
  }

  // 检查 meta keywords 是否未被实际输出。Google 已不读取 keywords，当前模板不应生成它。
  const runtimeMetadataSources = [
    path.join(projectRoot, 'src', 'app', '[locale]', 'layout.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', '[...slug]', 'page.tsx'),
  ]
  const hasRuntimeKeywords = runtimeMetadataSources
    .filter(source => fs.existsSync(source))
    .some(source => /\bkeywords\s*:/.test(fs.readFileSync(source, 'utf-8')))
  if (hasRuntimeKeywords) {
    addResult('errors', 'Keywords', '✗ metadata 中不应输出 keywords')
  } else {
    addResult('passed', 'Keywords', '✓ metadata 未输出 keywords')
  }

  // 检查 Open Graph
  if (metadataContent.includes('openGraph') && metadataContent.includes('/images/hero.webp')) {
    addResult('passed', 'OpenGraph', '✓ Open Graph 元数据完整')
  } else {
    addResult('warnings', 'OpenGraph', '⚠ Open Graph 元数据不完整')
  }

  // 检查 Twitter Card
  if (metadataContent.includes('twitter') && metadataContent.includes('summary_large_image') && metadataContent.includes('/images/hero.webp')) {
    addResult('passed', 'Twitter', '✓ Twitter Card 元数据完整')
  } else {
    addResult('warnings', 'Twitter', '⚠ Twitter Card 元数据不完整')
  }
}

// ============================================
// 3. 检查图片资源
// ============================================
function checkImages() {
  log('\n🖼️  检查图片资源...', 'cyan')

  const publicDir = path.join(projectRoot, 'public')

  // 检查 Hero / OG Image
  const heroImagePath = path.join(publicDir, 'images', 'hero.webp')
  if (fs.existsSync(heroImagePath)) {
    const stats = fs.statSync(heroImagePath)
    const sizeKB = (stats.size / 1024).toFixed(2)
    addResult('passed', 'Images', `✓ images/hero.webp 存在 (${sizeKB} KB)`)
  } else {
    addResult('errors', 'Images', '✗ images/hero.webp 不存在')
  }

  // 检查 Favicon
  const faviconFiles = ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png']
  const missingFavicons = faviconFiles.filter(file => !fs.existsSync(path.join(publicDir, file)))

  if (missingFavicons.length === 0) {
    addResult('passed', 'Favicon', '✓ 所有 Favicon 文件存在')
  } else {
    addResult('warnings', 'Favicon', `⚠ 缺少 Favicon 文件: ${missingFavicons.join(', ')}`)
  }
}

// ============================================
// 4. 检查多语言配置 (Hreflangs)
// ============================================
function checkHreflangs() {
  log('\n🌍 检查多语言配置...', 'cyan')

  const localesDir = path.join(projectRoot, 'src', 'locales')
  const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'))

  if (localeFiles.length > 1) {
    addResult('passed', 'Hreflangs', `✓ 支持 ${localeFiles.length} 种语言`)

    // 检查 i18n 配置
    const i18nRoutingPath = path.join(projectRoot, 'src', 'i18n', 'routing.ts')
    if (fs.existsSync(i18nRoutingPath)) {
      addResult('passed', 'Hreflangs', '✓ i18n routing 配置存在')
    } else {
      addResult('warnings', 'Hreflangs', '⚠ i18n routing 配置不存在')
    }
  } else {
    addResult('warnings', 'Hreflangs', '⚠ 只有单语言，建议添加多语言支持')
  }
}

// ============================================
// 5. 检查结构化数据 (JSON-LD)
// ============================================
function checkStructuredData() {
  log('\n📊 检查结构化数据...', 'cyan')

  // 检查是否有 JSON-LD 配置
  const sourcePaths = [
    path.join(projectRoot, 'src', 'app', '[locale]', 'layout.tsx'),
    path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'),
  ].filter(source => fs.existsSync(source))
  if (sourcePaths.length > 0) {
    const content = sourcePaths.map(source => fs.readFileSync(source, 'utf-8')).join('\n')

    // 检查是否有 Organization schema
    if (content.includes('Organization') || content.includes('WebSite')) {
      addResult('passed', 'Structured', '✓ 包含结构化数据配置')
    } else {
      addResult('warnings', 'Structured', '⚠ 未找到结构化数据（建议添加 Organization/WebSite schema）')
    }
  }
}

// ============================================
// 6. 检查页面内容结构
// ============================================
function checkPageStructure() {
  log('\n📄 检查页面结构...', 'cyan')

  const localeFile = path.join(projectRoot, 'src', 'locales', `${locale}.json`)
  if (!fs.existsSync(localeFile)) {
    return
  }

  const translations = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))

  // 检查 Hero 部分
  if (translations.hero?.title && translations.hero?.description) {
    addResult('passed', 'Content', '✓ Hero 部分内容完整')
  } else {
    addResult('warnings', 'Content', '⚠ Hero 部分内容不完整')
  }

  // 检查 FAQ
  const faqItems = translations.faq?.items || translations.faq?.questions
  if (Array.isArray(faqItems) && faqItems.length > 0) {
    addResult('passed', 'Content', `✓ FAQ 包含 ${faqItems.length} 个问题`)
  } else {
    addResult('warnings', 'Content', '⚠ 缺少 FAQ 内容')
  }

  // 检查工具/资源
  const toolItems = translations.tools?.items || translations.tools?.cards
  if (Array.isArray(toolItems) && toolItems.length > 0) {
    addResult('passed', 'Content', `✓ 工具/资源包含 ${toolItems.length} 个项目`)
  } else {
    addResult('warnings', 'Content', '⚠ 缺少工具/资源内容')
  }
}

// ============================================
// 7. 检查配置文件
// ============================================
function checkConfigFiles() {
  log('\n⚙️  检查配置文件...', 'cyan')

  // 检查 next.config
  const nextConfigPath = ['next.config.ts', 'next.config.mjs', 'next.config.js']
    .map(file => path.join(projectRoot, file))
    .find(file => fs.existsSync(file))
  if (nextConfigPath) {
    const content = fs.readFileSync(nextConfigPath, 'utf-8')

    // 检查是否配置了图片域名
    if (content.includes('remotePatterns') || content.includes('domains')) {
      addResult('passed', 'Config', '✓ Next.js 图片域名已配置')
    } else {
      addResult('warnings', 'Config', '⚠ Next.js 未配置图片域名')
    }
  }

  // 检查 manifest.json
  const manifestPath = path.join(projectRoot, 'public', 'manifest.json')
  if (fs.existsSync(manifestPath)) {
    addResult('passed', 'Config', '✓ manifest.json 存在')
  } else {
    addResult('warnings', 'Config', '⚠ manifest.json 不存在')
  }
}

// ============================================
// 主函数
// ============================================
async function main() {
  log('='.repeat(60), 'blue')
  log('🔍 SEO 检查工具', 'blue')
  log('='.repeat(60), 'blue')
  log(`检查语言: ${locale}`, 'cyan')

  try {
    checkRobotsAndSitemap()
    checkSEOMetadata()
    checkImages()
    checkHreflangs()
    checkStructuredData()
    checkPageStructure()
    checkConfigFiles()

    // 输出结果
    log('\n' + '='.repeat(60), 'blue')
    log('📊 检查结果汇总', 'blue')
    log('='.repeat(60), 'blue')

    // 通过的检查
    if (results.passed.length > 0) {
      log(`\n✅ 通过 (${results.passed.length})`, 'green')
      results.passed.forEach(({ category, message }) => {
        log(`  [${category}] ${message}`, 'green')
      })
    }

    // 警告
    if (results.warnings.length > 0) {
      log(`\n⚠️  警告 (${results.warnings.length})`, 'yellow')
      results.warnings.forEach(({ category, message }) => {
        log(`  [${category}] ${message}`, 'yellow')
      })
    }

    // 错误
    if (results.errors.length > 0) {
      log(`\n❌ 错误 (${results.errors.length})`, 'red')
      results.errors.forEach(({ category, message }) => {
        log(`  [${category}] ${message}`, 'red')
      })
    }

    // 总结
    log('\n' + '='.repeat(60), 'blue')
    const total = results.passed.length + results.warnings.length + results.errors.length
    const score = ((results.passed.length / total) * 100).toFixed(1)
    log(`总分: ${score}% (${results.passed.length}/${total})`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red')

    // 建议
    log('\n💡 建议:', 'cyan')
    log('  1. 优先修复所有 ❌ 错误项', 'cyan')
    log('  2. 然后处理 ⚠️  警告项', 'cyan')
    log('  3. 使用 AITDK 插件检查以下项目:', 'cyan')
    log('     - SERP 展现形态（缩略图、站点名）', 'cyan')
    log('     - PageSpeed / Core Web Vitals', 'cyan')
    log('     - Traffic 数据和竞品分析', 'cyan')

    log('\n' + '='.repeat(60), 'blue')

    // 退出码
    process.exit(results.errors.length > 0 ? 1 : 0)

  } catch (error) {
    log(`\n❌ 检查失败: ${error.message}`, 'red')
    if (verbose) {
      console.error(error)
    }
    process.exit(1)
  }
}

main()
