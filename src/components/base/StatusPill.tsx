import React from 'react'
import { cn } from '@/lib/utils'

export type StatusType = 'pending' | 'approved' | 'rejected'

type StatusPillProps = {
  status: StatusType
  size?: 'sm' | 'md'
  className?: string
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm', className }) => {
  const base = 'rounded-full font-semibold inline-flex items-center justify-center'
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
  const scheme =
    status === 'pending'
      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      : status === 'approved'
        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'

  return (
    <div className={cn(base, sizeClass, scheme, className)}>
      {status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
    </div>
  )
}

export default StatusPill
