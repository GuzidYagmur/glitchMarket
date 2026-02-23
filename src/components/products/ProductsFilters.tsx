interface ProductsFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  categoryFilter: string
  onCategoryChange: (v: string) => void
  categories: string[]
  glitchyOnly: boolean
  onGlitchyOnlyChange: (v: boolean) => void
  stockFilter: 'all' | 'in-stock' | 'out-of-stock' | 'negative'
  onStockFilterChange: (v: 'all' | 'in-stock' | 'out-of-stock' | 'negative') => void
}

export function ProductsFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  glitchyOnly,
  onGlitchyOnlyChange,
  stockFilter,
  onStockFilterChange,
}: ProductsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
      />

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={stockFilter}
        onChange={(e) =>
          onStockFilterChange(e.target.value as 'all' | 'in-stock' | 'out-of-stock' | 'negative')
        }
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">All Stock</option>
        <option value="in-stock">In Stock</option>
        <option value="out-of-stock">Out of Stock</option>
        <option value="negative">Negative Stock</option>
      </select>

      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
        <input
          type="checkbox"
          checked={glitchyOnly}
          onChange={(e) => onGlitchyOnlyChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        Glitchy only
      </label>
    </div>
  )
}
