import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock4 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const MOCK_USERS = [
  { id: 'u1', name: 'Alice', avatar: '/photo_2025-09-26_12-28-52 (2).jpg' },
  { id: 'u2', name: 'Bob', avatar: '/photo_2025-09-26_12-28-52 (3).jpg' },
  { id: 'u3', name: 'Charlie', avatar: '/photo_2025-09-26_12-28-54.jpg' },
]

export const SidebarTask = () => {
  const assigner = MOCK_USERS[2]
  const assignee = MOCK_USERS[0]

  return (
    <div className="lg:col-span-1">
      <Card className="border-0 shadow-sm sticky top-6 hidden lg:block">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Thông tin công việc</h3>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Người được giao
              </label>
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 text-white font-semibold">
                  {assignee.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{assignee.name}</div>
                  <div className="text-xs text-gray-500">Assignee</div>
                </div>
              </div>
            </div>

            {/* Assigner */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Người giao việc
              </label>
              <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 text-white font-semibold">
                  {assigner.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{assigner.name}</div>
                  <div className="text-xs text-gray-500">Reporter</div>
                </div>
              </div>
            </div>

            {/* Estimate */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Thời gian ước lượng
              </label>
              <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                  <Clock4 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900">8 giờ</div>
                  <div className="text-xs text-gray-500">Estimated time</div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Dates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Ngày tạo</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date('2025-10-29T09:30:00Z').toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Cập nhật</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {new Date('2025-10-29T13:15:00Z').toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
