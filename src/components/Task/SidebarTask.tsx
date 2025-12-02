import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Flag, CheckCircle2, Circle, XCircle, Clock, Clock4 } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const MOCK_USERS = [
  { id: 'u1', name: 'Alice', avatar: '/photo_2025-09-26_12-28-52 (2).jpg' },
  { id: 'u2', name: 'Bob', avatar: '/photo_2025-09-26_12-28-52 (3).jpg' },
  { id: 'u3', name: 'Charlie', avatar: '/photo_2025-09-26_12-28-54.jpg' },
]

const STATUS_OPTIONS = [
  { value: 'todo', label: 'Cần làm', icon: Circle, color: 'text-gray-500', bgColor: 'bg-gray-100' },
  {
    value: 'in_progress',
    label: 'Đang làm',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    value: 'done',
    label: 'Hoàn thành',
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  { value: 'cancel', label: 'Đã hủy', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100' },
]

const PRIORITY_OPTIONS = [
  {
    value: '1',
    label: 'Thấp',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-400',
  },
  {
    value: '2',
    label: 'Trung bình',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500',
  },
  {
    value: '3',
    label: 'Cao',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    dotColor: 'bg-orange-500',
  },
  {
    value: '4',
    label: 'Khẩn cấp',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    dotColor: 'bg-red-500',
  },
]

export const SidebarTask = () => {
  const [status, setStatus] = useState('in_progress')
  const [priority, setPriority] = useState('2')
  const assigner = MOCK_USERS[2]
  const assignee = MOCK_USERS[0]

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status)
  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority)

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    // TODO: Call API to update status
    console.log('Updating status to:', newStatus)
  }

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority)
    // TODO: Call API to update priority
    console.log('Updating priority to:', newPriority)
  }

  return (
    <div className="lg:col-span-1">
      <Card className="border-0 shadow-sm sticky top-6 hidden lg:block">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Thông tin công việc</h3>

          <div className="space-y-5">
            {/* Status Selector */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Trạng thái</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full h-10 border-gray-200 hover:border-gray-300 transition-colors">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {currentStatus && (
                        <>
                          <div
                            className={`w-8 h-8 rounded-lg ${currentStatus.bgColor} flex items-center justify-center`}
                          >
                            <currentStatus.icon className={`w-4 h-4 ${currentStatus.color}`} />
                          </div>
                          <span className="font-medium text-sm">{currentStatus.label}</span>
                        </>
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${option.bgColor} flex items-center justify-center`}
                        >
                          <option.icon className={`w-4 h-4 ${option.color}`} />
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Độ ưu tiên</label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full h-10 border-gray-200 hover:border-gray-300 transition-colors">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {currentPriority && (
                        <>
                          <div
                            className={`w-8 h-8 rounded-lg ${currentPriority.bgColor} flex items-center justify-center`}
                          >
                            <Flag className={`w-4 h-4 ${currentPriority.color}`} />
                          </div>
                          <span className="font-medium text-sm">{currentPriority.label}</span>
                        </>
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${option.bgColor} flex items-center justify-center`}
                        >
                          <Flag className={`w-4 h-4 ${option.color}`} />
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            {/* Assignee */}
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
