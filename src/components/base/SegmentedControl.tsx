import React from 'react'
import { cn } from '@/lib/utils'

export type SegmentedOption<ValueType extends string> = {
  label: string
  value: ValueType
}

type SegmentedControlProps<ValueType extends string> = {
  options: SegmentedOption<ValueType>[]
  value: ValueType
  onChange: (value: ValueType) => void
  className?: string
}

export function SegmentedControl<ValueType extends string>(
  props: SegmentedControlProps<ValueType>
) {
  const { options, value, onChange, className } = props
  return (
    <div className={cn('bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex gap-1', className)}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
              active
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
