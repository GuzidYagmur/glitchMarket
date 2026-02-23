import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { EditProductForm } from '../components/edit/EditProductForm'
import { AuditLogPanel } from '../components/edit/AuditLogPanel'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorAlert } from '../components/ui/ErrorAlert'
import { GlitchBadge } from '../components/ui/GlitchBadge'

export function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError, error } = useProduct(id ?? '')
  const [auditRefreshKey, setAuditRefreshKey] = useState(0)

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorAlert message={(error as Error).message} />
  if (!product) return <ErrorAlert message="Product not found." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/products/${product.id}`} className="text-sm text-indigo-600 hover:underline">
            ← Back to Detail
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500">SKU: {product.sku || '–'}</p>
        </div>
        <GlitchBadge score={product.glitchScore} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Product Information</h2>
          <EditProductForm
            product={product}
            onSaved={() => setAuditRefreshKey((k) => k + 1)}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Edit History</h2>
            <p className="text-xs text-gray-400 mb-4">Field changes for this product</p>
            <AuditLogPanel productId={product.id} refreshKey={auditRefreshKey} />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-amber-800 mb-2">Original Raw Data</h2>
            <pre className="overflow-x-auto rounded bg-amber-900 p-3 text-xs text-amber-100 font-mono">
              {JSON.stringify(product._raw, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
