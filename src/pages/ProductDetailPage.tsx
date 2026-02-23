import { Link, useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { ProductTabs } from '../components/product/ProductTabs'
import { GlitchReport } from '../components/product/GlitchReport'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorAlert } from '../components/ui/ErrorAlert'
import { GlitchBadge } from '../components/ui/GlitchBadge'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError, error } = useProduct(id ?? '')

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorAlert message={(error as Error).message} />
  if (!product) return <ErrorAlert message="Product not found." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-indigo-600 hover:underline">
            ← Back to Products
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: {product.sku || '–'}</p>
        </div>
        <div className="flex items-center gap-3">
          <GlitchBadge score={product.glitchScore} />
          <Link
            to={`/products/${product.id}/edit`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <ProductTabs product={product} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Glitch Report</h2>
          <p className="text-xs text-gray-400 mb-4">Issues detected in raw data</p>
          <GlitchReport issues={product.glitchIssues} />
        </div>
      </div>
    </div>
  )
}
