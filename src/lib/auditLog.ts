import type { AuditLogEntry, ProductFormValues } from '../types/product'

const STORAGE_KEY = 'glitchmarket_audit'

function readAll(): Record<string, AuditLogEntry[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, AuditLogEntry[]>) : {}
  } catch {
    return {}
  }
}

export function getAuditLog(productId: string): AuditLogEntry[] {
  return readAll()[productId] ?? []
}

export function appendAuditLog(
  productId: string,
  changes: Array<{ field: keyof ProductFormValues; oldValue: unknown; newValue: unknown }>,
): void {
  if (changes.length === 0) return
  const all = readAll()
  const existing = all[productId] ?? []
  const newEntries: AuditLogEntry[] = changes.map((c) => ({
    productId,
    timestamp: new Date().toISOString(),
    field: c.field,
    oldValue: c.oldValue as string | number | string[],
    newValue: c.newValue as string | number | string[],
  }))
  all[productId] = [...existing, ...newEntries]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
