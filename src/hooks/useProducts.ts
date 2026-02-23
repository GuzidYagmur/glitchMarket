import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getProducts,
    staleTime: 0,
  })
}
