import { Outlet } from 'react-router'
import MobileBottomNav from '@/components/ui/mobile-bottom-nav'
import { ScrollArea } from '@/components/ui/scroll-area'

const MobileLayout = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <ScrollArea className="flex-1">
        <main className="pb-20 px-4 min-h-screen">
          <Outlet />
        </main>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <MobileBottomNav />
      </div>
    </div>
  )
}

export default MobileLayout
