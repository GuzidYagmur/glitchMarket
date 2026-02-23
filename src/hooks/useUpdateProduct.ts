import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProduct } from '../api/products'
import type { Product } from '../types/product'
import { productKeys } from './useProducts'

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: Partial<Pick<Product, 'name' | 'price' | 'stock' | 'category'>>
    }) => updateProduct(id, patch),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct.id) })
    },
  })
}
