import type { GlitchIssue, GlitchType } from '../types/product'

export const GLITCH_PENALTIES: Record<GlitchType, number> = {
  PRICE_UNPARSEABLE: 30,
  STOCK_NEGATIVE: 20,
  UPDATED_AT_INVALID: 20,
  CATEGORY_FORMAT_WRONG: 10,
  NAME_EMPTY: 20,
  NAME_HAS_GARBAGE: 5,
}

export function calculateGlitchScore(issues: GlitchIssue[]): number {
  const total = issues.reduce((sum, issue) => sum + issue.scorePenalty, 0)
  return Math.min(total, 100)
}
