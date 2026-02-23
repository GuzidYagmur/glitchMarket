import { getAuditLog } from '../../lib/auditLog'
import type { AuditLogEntry } from '../../types/product'

interface AuditLogPanelProps {
  productId: string
  refreshKey?: number
}

function formatValue(value: string | number | string[]): string {
  if (Array.isArray(value)) return value.join(', ') || '–'
  if (value === '' || value === null || value === undefined) return '–'
  return String(value)
}

export function AuditLogPanel({ productId, refreshKey }: AuditLogPanelProps) {
  // refreshKey forces re-read from localStorage after each save
  void refreshKey
  const entries: AuditLogEntry[] = getAuditLog(productId)

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No edits recorded yet. Changes you make will appear here.
      </p>
    )
  }

  return (
    <ol className="space-y-3">
      {[...entries].reverse().map((entry, i) => (
        <li key={i} className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-700 capitalize">{entry.field}</span>
            <span className="text-xs text-gray-400">
              {new Date(entry.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-700 font-mono">
              {formatValue(entry.oldValue)}
            </span>
            <span className="text-gray-400">→</span>
            <span className="rounded bg-green-50 px-1.5 py-0.5 text-green-700 font-mono">
              {formatValue(entry.newValue)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}
