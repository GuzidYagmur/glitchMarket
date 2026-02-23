import type { Product } from '../../types/product'

interface NormalizedViewProps {
  product: Product
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="col-span-2 text-sm text-gray-900">{children}</dd>
    </div>
  )
}

export function NormalizedView({ product }: NormalizedViewProps) {
  return (
    <dl className="divide-y divide-gray-100">
      <Field label="ID">{product.id}</Field>
      <Field label="Name">{product.name}</Field>
      <Field label="SKU">{product.sku || <span className="text-gray-400">–</span>}</Field>
      <Field label="Price">
        {product.price !== null ? (
          `$${product.price.toFixed(2)}`
        ) : (
          <span className="text-red-500 italic">Unparseable</span>
        )}
      </Field>
      <Field label="Stock">
        <span className={product.stock < 0 ? 'text-red-600 font-semibold' : undefined}>
          {product.stock}
          {product.stock < 0 && ' (negative)'}
        </span>
      </Field>
      <Field label="Category">
        {product.category.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {product.category.map((c) => (
              <span
                key={c}
                className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic">Missing</span>
        )}
      </Field>
      <Field label="Updated At">
        {product.updatedAt ? (
          product.updatedAt.toLocaleString()
        ) : (
          <span className="text-red-500 italic">Invalid date</span>
        )}
      </Field>
      <Field label="Description">
        {product.description || <span className="text-gray-400 italic">–</span>}
      </Field>
    </dl>
  )
}
