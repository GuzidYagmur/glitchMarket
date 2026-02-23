interface GlitchBadgeProps {
  score: number
}

export function GlitchBadge({ score }: GlitchBadgeProps) {
  let colorClass = 'bg-green-100 text-green-800'
  let label = 'Clean'

  if (score >= 60) {
    colorClass = 'bg-red-100 text-red-800'
    label = 'Critical'
  } else if (score >= 30) {
    colorClass = 'bg-orange-100 text-orange-800'
    label = 'High'
  } else if (score > 0) {
    colorClass = 'bg-yellow-100 text-yellow-800'
    label = 'Low'
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
    >
      <span>{score}</span>
      <span className="text-xs font-normal opacity-75">{label}</span>
    </span>
  )
}
