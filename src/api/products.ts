import productsJson from '../../data/products.json'
import type { RawProduct } from '../types/raw'
import type { Product } from '../types/product'
import { normalizeProduct } from '../lib/normalize'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// In-memory overrides — persists within the browser session
const overrides = new Map<string, Partial<Pick<Product, 'name' | 'price' | 'stock' | 'category'>>>()

function applyOverrides(product: Product): Product {
  const override = overrides.get(product.id)
  if (!override) return product
  return { ...product, ...override }
}

export async function getProducts(): Promise<Product[]> {
  await delay(400)
  return (productsJson.products as RawProduct[])
    .map((raw) => normalizeProduct(raw))
    .map(applyOverrides)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(300)
  const rawList = productsJson.products as RawProduct[]
  const raw = rawList.find((p) => String(p.id) === id)
  if (!raw) return undefined
  return applyOverrides(normalizeProduct(raw))
}

export async function updateProduct(
  id: string,
  patch: Partial<Pick<Product, 'name' | 'price' | 'stock' | 'category'>>,
): Promise<Product> {
  await delay(300)
  const existing = overrides.get(id) ?? {}
  overrides.set(id, { ...existing, ...patch })
  const updated = await getProductById(id)
  if (!updated) throw new Error(`Product ${id} not found`)
  return updated
}
