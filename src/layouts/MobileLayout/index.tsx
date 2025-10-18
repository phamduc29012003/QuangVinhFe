import { Outlet } from 'react-router'
import MobileBottomNav from '@/components/ui/mobile-bottom-nav'
import { ScrollArea } from '@/components/ui/scroll-area'

const MobileLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-screen">
        <main className="pb-20 ph-10 min-h-screen">
          <Outlet />
        </main>
      </ScrollArea>

      <MobileBottomNav />
    </div>
  )
}

export default MobileLayout
