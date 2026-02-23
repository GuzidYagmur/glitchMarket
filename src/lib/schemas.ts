import { z } from 'zod'

export const editProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be under 200 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine(
      (val) => isFinite(parseFloat(val.replace(',', '.'))),
      { message: 'Price must be a valid number' },
    ),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number'),
  category: z
    .string()
    .min(1, 'Category is required'),
})

export type EditProductSchema = z.infer<typeof editProductSchema>
