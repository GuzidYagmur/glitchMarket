import type { GlitchIssue, GlitchType } from '../../types/product'

interface GlitchReportProps {
  issues: GlitchIssue[]
}

const TYPE_LABELS: Record<GlitchType, string> = {
  PRICE_UNPARSEABLE: 'Invalid Price',
  STOCK_NEGATIVE: 'Negative Stock',
  UPDATED_AT_INVALID: 'Invalid Date',
  CATEGORY_FORMAT_WRONG: 'Category Format',
  NAME_EMPTY: 'Missing Name',
  NAME_HAS_GARBAGE: 'Dirty Name',
}

const TYPE_COLORS: Record<GlitchType, string> = {
  PRICE_UNPARSEABLE: 'bg-red-100 text-red-700',
  STOCK_NEGATIVE: 'bg-orange-100 text-orange-700',
  UPDATED_AT_INVALID: 'bg-yellow-100 text-yellow-700',
  CATEGORY_FORMAT_WRONG: 'bg-blue-100 text-blue-700',
  NAME_EMPTY: 'bg-red-100 text-red-700',
  NAME_HAS_GARBAGE: 'bg-purple-100 text-purple-700',
}

export function GlitchReport({ issues }: GlitchReportProps) {
  if (issues.length === 0) {
    return (
      <p className="text-sm text-green-600 font-medium">
        No issues detected. Data is clean.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {issues.map((issue, i) => (
        <li key={i} className="rounded-md border border-gray-100 p-3 text-sm">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[issue.type]}`}
            >
              {TYPE_LABELS[issue.type]}
            </span>
            <span className="text-xs text-gray-400">-{issue.scorePenalty} pts</span>
          </div>
          <p className="text-gray-700">{issue.message}</p>
          <p className="mt-1 text-xs text-gray-400">
            Raw value:{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">
              {JSON.stringify(issue.rawValue)}
            </code>
          </p>
        </li>
      ))}
    </ul>
  )
}
