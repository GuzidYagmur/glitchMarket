import type { RawProduct } from './raw'

export type GlitchType =
  | 'PRICE_UNPARSEABLE'
  | 'STOCK_NEGATIVE'
  | 'UPDATED_AT_INVALID'
  | 'CATEGORY_FORMAT_WRONG'
  | 'NAME_EMPTY'
  | 'NAME_HAS_GARBAGE'

export interface GlitchIssue {
  type: GlitchType
  field: string
  rawValue: unknown
  message: string
  scorePenalty: number
}

export interface Product {
  id: string
  name: string
  price: number | null
  stock: number
  category: string[]
  updatedAt: Date | null
  description: string
  sku: string
  imageUrl: string
  glitchScore: number
  glitchIssues: GlitchIssue[]
  _raw: RawProduct
}

export interface ProductFormValues {
  name: string
  price: string
  stock: number
  category: string
}

export interface AuditLogEntry {
  productId: string
  timestamp: string
  field: keyof ProductFormValues
  oldValue: string | number | string[]
  newValue: string | number | string[]
}
