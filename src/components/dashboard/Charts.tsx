export function MiniLine({ className = 'h-24 w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className}>
      <polyline
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
        points="0,30 15,28 30,26 45,20 60,24 75,16 90,12 100,14"
      />
      <polyline fill="none" stroke="#d1d5db" strokeWidth="1" points="0,32 100,32" />
    </svg>
  )
}

export function MiniBar({ className = 'h-24 w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className}>
      {Array.from({ length: 8 }).map((_, i) => {
        const height = [10, 20, 12, 28, 18, 30, 22, 26][i]
        return (
          <rect
            key={i}
            x={i * 12 + 2}
            y={38 - height}
            width="8"
            height={height}
            fill="#2563eb"
            rx="1"
          />
        )
      })}
    </svg>
  )
}

export function MiniDonut({ className = 'h-24 w-24' }: { className?: string }) {
  return (
    <svg viewBox="0 0 42 42" className={className}>
      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="6" />
      <circle
        cx="21"
        cy="21"
        r="15.915"
        fill="transparent"
        stroke="#22c55e"
        strokeWidth="6"
        strokeDasharray="60 40"
        strokeDashoffset="25"
      />
    </svg>
  )
}

// Stacked mini bar showing Approved vs Pending leaves across a week
export function MiniLeaveStacked({ className = 'h-28 w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className}>
      {Array.from({ length: 7 }).map((_, i) => {
        const approved = [8, 4, 6, 10, 5, 2, 3][i]
        const pending = [2, 1, 3, 2, 1, 1, 1][i]
        const x = i * 16 + 6
        const base = 54
        return (
          <g key={i}>
            <rect x={x} y={base - approved} width="10" height={approved} fill="#22c55e" rx="1" />
            <rect
              x={x}
              y={base - approved - pending}
              width="10"
              height={pending}
              fill="#f59e0b"
              rx="1"
            />
          </g>
        )
      })}
      <line x1="0" y1="54" x2="120" y2="54" stroke="#e5e7eb" strokeWidth="1" />
    </svg>
  )
}
