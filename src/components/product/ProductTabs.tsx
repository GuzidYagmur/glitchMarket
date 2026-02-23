import { useState } from 'react'
import type { Product } from '../../types/product'
import { NormalizedView } from './NormalizedView'
import { RawJsonView } from './RawJsonView'

interface ProductTabsProps {
  product: Product
}

type Tab = 'normalized' | 'raw'

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('normalized')

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {(['normalized', 'raw'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'normalized' ? 'Normalized View' : 'Raw JSON'}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === 'normalized' ? (
          <NormalizedView product={product} />
        ) : (
          <RawJsonView raw={product._raw} />
        )}
      </div>
    </div>
  )
}
