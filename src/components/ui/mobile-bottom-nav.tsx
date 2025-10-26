import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Home, FileText, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    icon: Home,
    path: '/mobile/dashboard',
  },
  {
    id: 'assignments',
    label: 'Công việc',
    icon: FileText,
    path: '/mobile/assignments',
  },
  {
    id: 'documents',
    label: 'Tài liệu',
    icon: BookOpen,
    path: '/mobile/documents',
  },
  {
    id: 'profile',
    label: 'Cá nhân',
    icon: User,
    path: '/mobile/profile',
  },
]

const MobileBottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background z-50">
      <Separator />
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 h-auto',
                'hover:bg-blue-50',
                active && 'bg-blue-50'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 mb-1 transition-colors',
                  active ? 'text-blue-600' : 'text-gray-500'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors truncate',
                  active ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomNav
