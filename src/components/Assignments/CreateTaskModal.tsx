import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TASK_PRIORITY_LABELS, TASK_TYPE_LABELS, TASK_STATUS } from '@/constants/assignments/task'
import { X, Calendar, Image as ImageIcon, ListChecks } from 'lucide-react'
import type { IMemberTask } from '@/hooks/assignments/useGetMemberTask'

export type CreateTaskFormData = {
  description: string
  priority: number
  taskType: number
  estimateTime: number
  assignee?: {
    id: number
    name: string
  }
  status?: number
  startTime?: number
  imageUrls?: string[]
  checkList?: string
}

export type CreateTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberTask: IMemberTask[]
  onCreate: (data: CreateTaskFormData) => void
  groupId?: number
  mode?: 'create' | 'edit'
  initialData?: CreateTaskFormData
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  memberTask,
  onCreate,
  mode = 'create',
  initialData,
}) => {
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>('2')
  const [taskType, setTaskType] = useState<string>('1')
  const [status, setStatus] = useState<string>(String(TASK_STATUS.CREATED))
  const [startDate, setStartDate] = useState('')
  const [estimateDate, setEstimateDate] = useState('')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [imageUrl, setImageUrl] = useState('')
  const [checkList, setCheckList] = useState('')

  // Reset or fill data when open/mode/initialData changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setDescription(initialData.description)
        setPriority(String(initialData.priority))
        setTaskType(String(initialData.taskType))
        setStatus(String(initialData.status || TASK_STATUS.CREATED))

        // Format dates for input type="datetime-local" (YYYY-MM-DDThh:mm)
        const formatDate = (timestamp?: number) => {
          if (!timestamp) return ''
          return new Date(timestamp).toISOString().slice(0, 16)
        }

        setStartDate(formatDate(initialData.startTime))
        setEstimateDate(formatDate(initialData.estimateTime))

        setAssigneeId(initialData.assignee?.id ? String(initialData.assignee.id) : '')
        setImageUrl(initialData.imageUrls?.[0] || '')
        setCheckList(initialData.checkList || '')
      } else {
        reset()
      }
    }
  }, [open, mode, initialData])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  function reset() {
    setDescription('')
    setPriority('2')
    setTaskType('1')
    setStatus(String(TASK_STATUS.CREATED))
    setStartDate('')
    setEstimateDate('')
    setAssigneeId('')
    setImageUrl('')
    setCheckList('')
  }

  function handleCreate() {
    if (!description.trim()) return
    if (!estimateDate) return

    const estimateTime = new Date(estimateDate).getTime()
    const startTime = startDate ? new Date(startDate).getTime() : undefined

    // Find selected member to get name
    const selectedMember = assigneeId
      ? memberTask.find((m) => String(m.id) === assigneeId)
      : undefined

    onCreate({
      description: description.trim(),
      priority: Number(priority),
      taskType: Number(taskType),
      estimateTime,
      assignee: selectedMember
        ? {
            id: Number(selectedMember.id),
            name: String(selectedMember.name || selectedMember.email || ''),
          }
        : undefined,
      status: Number(status),
      startTime,
      imageUrls: imageUrl.trim() ? [imageUrl.trim()] : undefined,
      checkList: checkList.trim() || undefined,
    })
    reset()
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {mode === 'edit'
                ? 'Cập nhật thông tin công việc'
                : 'Định nghĩa chi tiết công việc và phân công người thực hiện'}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Tên công việc <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập tên công việc..."
            />
          </div>

          {/* Priority & Task Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Mức độ ưu tiên <span className="text-red-500">*</span>
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskType" className="text-sm font-medium text-gray-700">
                Loại công việc <span className="text-red-500">*</span>
              </Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger id="taskType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status & Start Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Trạng thái
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(TASK_STATUS.CREATED)}>Đã tạo</SelectItem>
                  <SelectItem value={String(TASK_STATUS.VISIBLE)}>Hiển thị</SelectItem>
                  <SelectItem value={String(TASK_STATUS.PENDING)}>Chờ xử lý</SelectItem>
                  <SelectItem value={String(TASK_STATUS.IN_PROGRESS)}>Đang thực hiện</SelectItem>
                  <SelectItem value={String(TASK_STATUS.COMPLETED)}>Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Thời gian bắt đầu (tùy chọn)
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Estimate Time & Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="estimateDate"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Thời gian dự kiến hoàn thành <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estimateDate"
                type="datetime-local"
                value={estimateDate}
                onChange={(e) => setEstimateDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-medium text-gray-700">
                Người thực hiện
              </Label>
              <Select
                value={assigneeId || 'unassigned'}
                onValueChange={(val) => setAssigneeId(val === 'unassigned' ? '' : val)}
              >
                <SelectTrigger id="assignee" className="w-full">
                  <SelectValue placeholder="Chưa phân công" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Chưa phân công</SelectItem>
                  {Array.isArray(memberTask) &&
                    memberTask
                      .filter((member) => member && member.id != null && member.id !== '')
                      .map((member) => (
                        <SelectItem key={String(member.id)} value={String(member.id)}>
                          {String(member.name || member.email || 'Unknown')}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label
              htmlFor="imageUrl"
              className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4" />
              URL hình ảnh (tùy chọn)
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <Label
              htmlFor="checkList"
              className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
            >
              <ListChecks className="w-4 h-4" />
              Checklist (tùy chọn)
            </Label>
            <Textarea
              id="checkList"
              value={checkList}
              onChange={(e) => setCheckList(e.target.value)}
              placeholder="Nhập các mục công việc cần kiểm tra, mỗi mục một dòng..."
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <Button
            variant="outline"
            onClick={() => {
              reset()
              onOpenChange(false)
            }}
            className="min-w-[100px]"
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!description.trim() || !estimateDate}
            className="min-w-[100px] bg-slate-900 hover:bg-slate-800"
          >
            {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo công việc'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateTaskModal
