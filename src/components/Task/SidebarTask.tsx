import { Separator } from '@radix-ui/react-dropdown-menu'
import { Card, CardContent } from '../ui/card'
import { Clock4, UserPlus2, UserCircle2, Calendar } from 'lucide-react'

const MOCK_USERS = [
  { id: 'u1', name: 'Alice', avatar: '/photo_2025-09-26_12-28-52 (2).jpg' },
  { id: 'u2', name: 'Bob', avatar: '/photo_2025-09-26_12-28-52 (3).jpg' },
  { id: 'u3', name: 'Charlie', avatar: '/photo_2025-09-26_12-28-54.jpg' },
]
export const SidebarTask = () => {
  const assigner = MOCK_USERS[2]
  return (
    <>
      <div className="lg:col-span-1">
        <Card className="border-0 shadow-sm sticky top-6 hidden lg:block">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Thông tin</h3>

            <div className="space-y-4">
              {/* Assignee */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <UserPlus2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Người được giao</div>
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {assigner?.name || <span className="text-gray-400">Chưa gán</span>}
                  </div>
                </div>
              </div>

              {/* Assigner */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <UserCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Người giao</div>
                  <div className="font-medium text-sm text-gray-900 truncate">{assigner.name}</div>
                </div>
              </div>

              {/* Estimate */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Clock4 className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Ước lượng</div>
                  <div className="font-medium text-sm text-gray-900">2 giờ</div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Created Date */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Ngày tạo</div>
                  <div className="font-medium text-sm text-gray-900">
                    {new Date('2025-10-29T09:30:00Z').toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Updated Date */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">Cập nhật</div>
                  <div className="font-medium text-sm text-gray-900">
                    {new Date('2025-10-29T13:15:00Z').toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
