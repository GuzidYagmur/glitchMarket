import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types/product'
import { editProductSchema, type EditProductSchema } from '../../lib/schemas'
import { useUpdateProduct } from '../../hooks/useUpdateProduct'
import { appendAuditLog } from '../../lib/auditLog'

interface EditProductFormProps {
  product: Product
  onSaved?: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-600">{message}</p>
}

export function EditProductForm({ product, onSaved }: EditProductFormProps) {
  const navigate = useNavigate()
  const { mutate: updateProduct, isPending } = useUpdateProduct()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProductSchema>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name === '[No Name]' ? '' : product.name,
      price: product.price !== null ? String(product.price) : '',
      stock: product.stock,
      category: product.category.join(', '),
    },
  })

  useEffect(() => {
    reset({
      name: product.name === '[No Name]' ? '' : product.name,
      price: product.price !== null ? String(product.price) : '',
      stock: product.stock,
      category: product.category.join(', '),
    })
  }, [product.id, reset])

  function onSubmit(values: EditProductSchema) {
    const parsedPrice = parseFloat(values.price.replace(',', '.'))
    const parsedCategory = values.category.split(',').map((c) => c.trim()).filter(Boolean)

    const changes: Array<{ field: keyof EditProductSchema; oldValue: unknown; newValue: unknown }> = []

    const oldName = product.name === '[No Name]' ? '' : product.name
    if (values.name !== oldName) changes.push({ field: 'name', oldValue: oldName, newValue: values.name })

    const oldPrice = product.price !== null ? String(product.price) : ''
    if (values.price !== oldPrice) changes.push({ field: 'price', oldValue: oldPrice, newValue: values.price })

    if (values.stock !== product.stock) changes.push({ field: 'stock', oldValue: product.stock, newValue: values.stock })

    const oldCategory = product.category.join(', ')
    if (values.category !== oldCategory) changes.push({ field: 'category', oldValue: oldCategory, newValue: values.category })

    if (changes.length > 0) appendAuditLog(product.id, changes)

    updateProduct(
      {
        id: product.id,
        patch: {
          name: values.name,
          price: parsedPrice,
          stock: values.stock,
          category: parsedCategory,
        },
      },
      {
        onSuccess: () => {
          onSaved?.()
          navigate(`/products/${product.id}`)
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          {...register('name')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Product name"
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input
          {...register('price')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 29.99"
        />
        <FieldError message={errors.price?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input
          {...register('stock', { valueAsNumber: true })}
          type="number"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 10"
        />
        <FieldError message={errors.stock?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
          <span className="ml-1 text-xs text-gray-400">(comma-separated)</span>
        </label>
        <input
          {...register('category')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Electronics, Sale"
        />
        <FieldError message={errors.category?.message} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
