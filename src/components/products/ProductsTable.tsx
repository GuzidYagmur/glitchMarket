import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { GlitchBadge } from '../ui/GlitchBadge'

type SortKey = 'name' | 'price' | 'stock' | 'glitchScore'

interface ProductsTableProps {
  products: Product[]
  sortBy: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
}

function SortIndicator({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  if (!active) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

export function ProductsTable({ products, sortBy, sortDir, onSort }: ProductsTableProps) {
  const sortableColumns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'glitchScore', label: 'GlitchScore' },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {sortableColumns.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => onSort(key)}
                className="cursor-pointer select-none px-4 py-3 text-left font-semibold text-gray-600 hover:bg-gray-100"
              >
                {label}
                <SortIndicator active={sortBy === key} dir={sortDir} />
              </th>
            ))}
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Updated At</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-gray-400">
                No products match the current filters.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {product.price !== null ? `$${product.price.toFixed(2)}` : (
                    <span className="text-red-500 italic">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock < 0
                        ? 'text-red-600 font-semibold'
                        : product.stock === 0
                        ? 'text-gray-400'
                        : 'text-gray-700'
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <GlitchBadge score={product.glitchScore} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.category.length > 0 ? product.category.join(', ') : (
                    <span className="text-gray-400 italic">–</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.updatedAt
                    ? product.updatedAt.toLocaleDateString()
                    : <span className="text-red-400 italic">Invalid</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="rounded px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                    >
                      Detail
                    </Link>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
