import type { RawProduct } from '../types/raw'
import type { Product, GlitchIssue } from '../types/product'
import { calculateGlitchScore } from './glitchScore'

function parsePrice(raw: unknown): number | null {
  if (typeof raw === 'number' && isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const cleaned = raw
      .replace(/[€$£¥]/g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '')
    const parsed = parseFloat(cleaned)
    return isFinite(parsed) ? parsed : null
  }
  return null
}

function parseStock(raw: unknown): number {
  if (typeof raw === 'number') return raw
  if (typeof raw === 'string') {
    const parsed = parseInt(raw, 10)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function cleanName(raw: unknown): string {
  if (typeof raw !== 'string') return '[No Name]'
  const stripped = raw.replace(/\p{Emoji}/gu, '').trim()
  return stripped.length > 0 ? stripped : '[No Name]'
}

function parseCategory(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string')
  if (typeof raw === 'string' && raw.trim().length > 0) return [raw.trim()]
  return []
}

function parseDate(raw: unknown): Date | null {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') return null
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

export function getGlitchReport(raw: RawProduct): GlitchIssue[] {
  const issues: GlitchIssue[] = []

  const nameAfterStrip =
    typeof raw.name === 'string' ? raw.name.replace(/\p{Emoji}/gu, '').trim() : ''

  if (!raw.name || nameAfterStrip.length === 0) {
    issues.push({
      type: 'NAME_EMPTY',
      field: 'name',
      rawValue: raw.name,
      message: 'Product name is missing or empty after cleaning.',
      scorePenalty: 20,
    })
  } else if (typeof raw.name === 'string' && /\p{Emoji}/gu.test(raw.name)) {
    issues.push({
      type: 'NAME_HAS_GARBAGE',
      field: 'name',
      rawValue: raw.name,
      message: 'Product name contains emojis or extra characters.',
      scorePenalty: 5,
    })
  }

  if (parsePrice(raw.price) === null) {
    issues.push({
      type: 'PRICE_UNPARSEABLE',
      field: 'price',
      rawValue: raw.price,
      message: `Price "${raw.price}" cannot be parsed as a number.`,
      scorePenalty: 30,
    })
  }

  const parsedStock = parseStock(raw.stock)
  if (parsedStock < 0) {
    issues.push({
      type: 'STOCK_NEGATIVE',
      field: 'stock',
      rawValue: raw.stock,
      message: `Stock value is negative (${raw.stock}).`,
      scorePenalty: 20,
    })
  }

  if (parseDate(raw.updatedAt) === null) {
    issues.push({
      type: 'UPDATED_AT_INVALID',
      field: 'updatedAt',
      rawValue: raw.updatedAt,
      message: `updatedAt "${raw.updatedAt}" is not a valid date.`,
      scorePenalty: 20,
    })
  }

  if (Array.isArray(raw.category)) {
    issues.push({
      type: 'CATEGORY_FORMAT_WRONG',
      field: 'category',
      rawValue: raw.category,
      message: 'Category is an array instead of a string.',
      scorePenalty: 10,
    })
  } else if (!raw.category) {
    issues.push({
      type: 'CATEGORY_FORMAT_WRONG',
      field: 'category',
      rawValue: raw.category,
      message: 'Category is missing or null.',
      scorePenalty: 10,
    })
  }

  return issues
}

export function normalizeProduct(raw: RawProduct): Product {
  const issues = getGlitchReport(raw)
  const score = calculateGlitchScore(issues)

  return {
    id: String(raw.id ?? ''),
    name: cleanName(raw.name),
    price: parsePrice(raw.price),
    stock: parseStock(raw.stock),
    category: parseCategory(raw.category),
    updatedAt: parseDate(raw.updatedAt),
    description: typeof raw.description === 'string' ? raw.description : '',
    sku: typeof raw.sku === 'string' ? raw.sku : '',
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : '',
    glitchScore: score,
    glitchIssues: issues,
    _raw: raw,
  }
}
