export interface RawProduct {
  id: string | number | undefined
  name: string | null | undefined
  price: number | string | null | undefined
  stock: number | string | null | undefined
  category: string | string[] | null | undefined
  updatedAt: string | null | undefined
  description?: string | null
  sku?: string | null | undefined
  imageUrl?: string | null | undefined
}
