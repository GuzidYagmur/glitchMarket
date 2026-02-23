import { useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductsTable } from '../components/products/ProductsTable'
import { ProductsFilters } from '../components/products/ProductsFilters'
import { Pagination } from '../components/ui/Pagination'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorAlert } from '../components/ui/ErrorAlert'
import type { Product } from '../types/product'

type SortKey = 'name' | 'price' | 'stock' | 'glitchScore'
type StockFilter = 'all' | 'in-stock' | 'out-of-stock' | 'negative'

const PAGE_SIZE = 10

export function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [glitchyOnly, setGlitchyOnly] = useState(false)
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [sortBy, setSortBy] = useState<SortKey>('glitchScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)

  const categories = useMemo(() => {
    if (!products) return []
    const set = new Set<string>()
    products.forEach((p) => p.category.forEach((c) => set.add(c)))
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    let list: Product[] = products ?? []

    if (search) {
      const lower = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(lower))
    }

    if (categoryFilter) {
      list = list.filter((p) => p.category.includes(categoryFilter))
    }

    if (glitchyOnly) {
      list = list.filter((p) => p.glitchScore > 0)
    }

    if (stockFilter === 'in-stock') list = list.filter((p) => p.stock > 0)
    else if (stockFilter === 'out-of-stock') list = list.filter((p) => p.stock === 0)
    else if (stockFilter === 'negative') list = list.filter((p) => p.stock < 0)

    list = [...list].sort((a, b) => {
      const aVal = a[sortBy] ?? 0
      const bVal = b[sortBy] ?? 0
      if (aVal === bVal) return 0
      return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
    })

    return list
  }, [products, search, categoryFilter, glitchyOnly, stockFilter, sortBy, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
    setPage(0)
  }

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setPage(0)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorAlert message={(error as Error).message} />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <span className="text-sm text-gray-500">
          {filtered.length} of {products?.length ?? 0} products
        </span>
      </div>

      <ProductsFilters
        search={search}
        onSearchChange={handleFilterChange(setSearch)}
        categoryFilter={categoryFilter}
        onCategoryChange={handleFilterChange(setCategoryFilter)}
        categories={categories}
        glitchyOnly={glitchyOnly}
        onGlitchyOnlyChange={handleFilterChange(setGlitchyOnly)}
        stockFilter={stockFilter}
        onStockFilterChange={handleFilterChange(setStockFilter)}
      />

      <ProductsTable
        products={paginated}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
