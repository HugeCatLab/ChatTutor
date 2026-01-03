import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm [a&]:hover:bg-gray-200 dark:[a&]:hover:bg-gray-600',
        destructive:
         'border-transparent bg-destructive text-white shadow-sm [a&]:hover:bg-destructive/90',
        outline:
          'text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 [a&]:hover:bg-gray-100 dark:[a&]:hover:bg-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
