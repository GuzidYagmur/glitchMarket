import type { RawProduct } from '../../types/raw'

interface RawJsonViewProps {
  raw: RawProduct
}

export function RawJsonView({ raw }: RawJsonViewProps) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-300 font-mono leading-relaxed">
      {JSON.stringify(raw, null, 2)}
    </pre>
  )
}
