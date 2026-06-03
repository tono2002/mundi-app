import { ReactNode } from 'react'

type BadgeVariant = 'green' | 'gray' | 'amber' | 'red' | 'blue'

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-600',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-700',
}

export default function Badge({
  variant = 'gray',
  children,
  className = '',
}: {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
