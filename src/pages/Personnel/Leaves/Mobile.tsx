import { useState } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Button } from '@/components/ui/button.tsx'
import { SegmentedControl } from '@/components/base/SegmentedControl'
import { StatusPill } from '@/components/base/StatusPill'
import { BottomCTA } from '@/components/base/BottomCTA'
import {
  Calendar,
  Umbrella,
  Heart,
  Baby,
  Plane,
  Briefcase,
  Clock,
  CheckCircle2,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'

type LeaveStatus = 'pending' | 'approved' | 'rejected'

type LeaveType =
  | 'Nghỉ phép năm'
  | 'Nghỉ ốm'
  | 'Nghỉ không lương'
  | 'Nghỉ thai sản'
  | 'Nghỉ hiếu'
  | 'Nghỉ cưới'

type LeaveRequest = {
  id: string
  employeeName?: string
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  createdAt: string
}

const seed: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Bạn',
    type: 'Nghỉ phép năm',
    startDate: '2025-10-30',
    endDate: '2025-11-01',
    reason: 'Về quê có việc gia đình',
    status: 'pending',
    createdAt: '2025-10-28T10:00:00',
  },
  {
    id: '2',
    employeeName: 'Bạn',
    type: 'Nghỉ ốm',
    startDate: '2025-10-29',
    endDate: '2025-10-29',
    reason: 'Cảm cúm',
    status: 'approved',
    createdAt: '2025-10-27T14:30:00',
  },
]

// Helper functions
const getLeaveIcon = (type: LeaveType) => {
  const icons = {
    'Nghỉ phép năm': Plane,
    'Nghỉ ốm': Heart,
    'Nghỉ không lương': Briefcase,
    'Nghỉ thai sản': Baby,
    'Nghỉ hiếu': Umbrella,
    'Nghỉ cưới': Calendar,
  }
  return icons[type] || Calendar
}

const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

import { useAuthStore } from '@/stores/authStore'

export default function LeavesMobile() {
  const { user } = useAuthStore()
  const roles = user?.roles || []
  const canApprove = roles.includes('DIRECTOR') || roles.includes('MANAGER')
  const [items, setItems] = useState<LeaveRequest[]>(seed)
  const [type, setType] = useState<LeaveType | ''>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [createSheetOpen, setCreateSheetOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [viewSheetOpen, setViewSheetOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [actionRequestId, setActionRequestId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | 'all'>('all')

  // Validation
  const validateForm = (): boolean => {
    if (!type) {
      toast.error('Vui lòng chọn loại nghỉ')
      return false
    }
    if (!startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu')
      return false
    }
    if (!endDate) {
      toast.error('Vui lòng chọn ngày kết thúc')
      return false
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Ngày bắt đầu không thể sau ngày kết thúc')
      return false
    }
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do xin nghỉ')
      return false
    }
    return true
  }

  function addItem() {
    if (!validateForm()) return

    const newItem: LeaveRequest = {
      id: String(Date.now()),
      employeeName: 'Bạn',
      type: type as LeaveType,
      startDate,
      endDate,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setItems((prev) => [newItem, ...prev])
    setType('')
    setStartDate('')
    setEndDate('')
    setReason('')
    setCreateSheetOpen(false)

    const days = calculateDays(startDate, endDate)
    toast.success('Tạo đơn thành công!', {
      description: `Đơn xin nghỉ ${days} ngày đã được gửi`,
    })
  }

  function handleActionClick(id: string, action: 'approve' | 'reject') {
    setActionRequestId(id)
    setActionType(action)
    setConfirmDialogOpen(true)
  }

  function confirmAction() {
    if (!actionRequestId || !actionType) return

    const status: LeaveStatus = actionType === 'approve' ? 'approved' : 'rejected'
    setItems((prev) => prev.map((r) => (r.id === actionRequestId ? { ...r, status } : r)))

    const request = items.find((r) => r.id === actionRequestId)
    if (request) {
      if (actionType === 'approve') {
        toast.success('Đã duyệt đơn!')
      } else {
        toast.error('Đã từ chối đơn!')
      }
    }

    setConfirmDialogOpen(false)
    setActionRequestId(null)
    setActionType(null)
  }

  function viewDetails(request: LeaveRequest) {
    setSelectedRequest(request)
    setViewSheetOpen(true)
  }

  // Statistics
  const stats = {
    total: items.length,
    pending: items.filter((r) => r.status === 'pending').length,
    approved: items.filter((r) => r.status === 'approved').length,
    rejected: items.filter((r) => r.status === 'rejected').length,
  }

  // Filtered items
  const filteredItems =
    filterStatus === 'all' ? items : items.filter((item) => item.status === filterStatus)

  return (
    <div className="flex flex-col h-screen dark:bg-gray-950">
      {/* iOS-style Navigation Bar */}
      {/* Header removed; CTA moved to floating button */}

      {/* iOS-style Statistics Cards */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
              {stats.pending}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Chờ duyệt</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
              {stats.approved}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Đã duyệt</p>
          </div>
        </div>
      </div>

      {/* iOS-style Segmented Control Filter */}
      <div className="px-4 pb-2">
        <SegmentedControl
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Chờ duyệt', value: 'pending' },
            { label: 'Đã duyệt', value: 'approved' },
          ]}
          value={filterStatus as 'all' | 'pending' | 'approved'}
          onChange={(v) => setFilterStatus(v as any)}
        />
      </div>

      {/* iOS-style List */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Calendar className="size-10 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
              Chưa có đơn nghỉ phép
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tạo đơn mới để bắt đầu</p>
            <Button onClick={() => setCreateSheetOpen(true)} className="h-8 px-4 pb-2">
              <Plus className="size-4 mr-1" /> Tạo đơn xin nghỉ
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((r) => (
              <div key={r.id}>
                {/* iOS-style List Item */}
                <div
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
                  onClick={() => viewDetails(r)}
                >
                  {/* Main Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center ${
                            r.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-900/30'
                              : r.status === 'approved'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-rose-100 dark:bg-rose-900/30'
                          }`}
                        >
                          {(() => {
                            const Icon = getLeaveIcon(r.type)
                            return (
                              <Icon
                                className={`size-5 ${
                                  r.status === 'pending'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : r.status === 'approved'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-rose-600 dark:text-rose-400'
                                }`}
                              />
                            )
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-0.5">
                            {r.type}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(r.startDate)} - {formatDate(r.endDate)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-gray-400 dark:text-gray-600 flex-shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4 text-gray-400 dark:text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {calculateDays(r.startDate, r.endDate)} ngày
                        </span>
                      </div>
                      <StatusPill status={r.status} size="sm" />
                    </div>

                    {r.reason && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {r.reason}
                      </p>
                    )}

                    {/* Action Buttons - Only for pending AND allowed roles */}
                    {r.status === 'pending' && canApprove && (
                      <>
                        <Separator className="my-3 opacity-60" />
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick(r.id, 'approve')
                            }}
                            className="flex-1 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200/60 dark:border-emerald-800/40"
                            variant="secondary"
                          >
                            Duyệt
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick(r.id, 'reject')
                            }}
                            className="flex-1 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-200/60 dark:border-rose-800/40"
                            variant="secondary"
                          >
                            Từ chối
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA - pill style (above bottom nav) */}
      <BottomCTA
        visible={!(createSheetOpen || viewSheetOpen || confirmDialogOpen)}
        onClick={() => setCreateSheetOpen(true)}
        label="Tạo đơn xin nghỉ"
        icon={<Plus className="size-4" />}
        bottomOffsetClassName="bottom-22"
      />

      {/* View Details Sheet - iOS Style */}
      <Sheet open={viewSheetOpen} onOpenChange={setViewSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 pb-6">
          <SheetHeader className="text-left pb-4">
            <SheetTitle className="text-xl font-bold">Chi tiết đơn nghỉ</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              Thông tin chi tiết về đơn xin nghỉ
            </SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="space-y-4 pb-6">
              {/* iOS-style Info Card */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loại nghỉ</span>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = getLeaveIcon(selectedRequest.type)
                      return <Icon className="size-5 text-blue-600 dark:text-blue-400" />
                    })()}
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.type}
                    </span>
                  </div>
                </div>
                <Separator className="opacity-60" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Từ ngày</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedRequest.startDate)}
                  </span>
                </div>
                <Separator className="opacity-60" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Đến ngày</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedRequest.endDate)}
                  </span>
                </div>
                <Separator className="opacity-60" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Số ngày nghỉ</span>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gray-400" />
                    <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                      {calculateDays(selectedRequest.startDate, selectedRequest.endDate)} ngày
                    </span>
                  </div>
                </div>
                <Separator className="opacity-60" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</span>
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      selectedRequest.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : selectedRequest.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {selectedRequest.status === 'pending'
                      ? 'Chờ duyệt'
                      : selectedRequest.status === 'approved'
                        ? 'Đã duyệt'
                        : 'Từ chối'}
                  </div>
                </div>
              </div>

              {/* Reason Section */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Lý do nghỉ
                </Label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedRequest.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              {actionType === 'approve' ? 'Xác nhận duyệt đơn' : 'Xác nhận từ chối đơn'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              {actionType === 'approve'
                ? 'Bạn có chắc chắn muốn duyệt đơn xin nghỉ này không?'
                : 'Bạn có chắc chắn muốn từ chối đơn xin nghỉ này không?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} className="text-xs">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Leave Request Sheet - iOS Style */}
      <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto p-4 pb-6">
          <SheetHeader className="text-left pb-4">
            <SheetTitle className="text-xl font-bold">Tạo đơn xin nghỉ</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              Điền thông tin để gửi đơn xin nghỉ mới
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 pb-6">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile-type"
                className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                Loại nghỉ <span className="text-red-500">*</span>
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as LeaveType)}>
                <SelectTrigger
                  id="mobile-type"
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700"
                >
                  <SelectValue placeholder="Chọn loại nghỉ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nghỉ phép năm">
                    <div className="flex items-center gap-2">
                      <Plane className="size-4" />
                      Nghỉ phép năm
                    </div>
                  </SelectItem>
                  <SelectItem value="Nghỉ ốm">
                    <div className="flex items-center gap-2">
                      <Heart className="size-4" />
                      Nghỉ ốm
                    </div>
                  </SelectItem>
                  <SelectItem value="Nghỉ không lương">
                    <div className="flex items-center gap-2">
                      <Briefcase className="size-4" />
                      Nghỉ không lương
                    </div>
                  </SelectItem>
                  <SelectItem value="Nghỉ thai sản">
                    <div className="flex items-center gap-2">
                      <Baby className="size-4" />
                      Nghỉ thai sản
                    </div>
                  </SelectItem>
                  <SelectItem value="Nghỉ hiếu">
                    <div className="flex items-center gap-2">
                      <Umbrella className="size-4" />
                      Nghỉ hiếu
                    </div>
                  </SelectItem>
                  <SelectItem value="Nghỉ cưới">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      Nghỉ cưới
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="mobile-start"
                  className="text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Từ ngày <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="mobile-end"
                  className="text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Đến ngày <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Days Calculation */}
            {startDate && endDate && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                      Tổng số ngày nghỉ
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {calculateDays(startDate, endDate)} ngày
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile-reason"
                className="text-sm font-semibold text-gray-900 dark:text-white"
              >
                Lý do <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="mobile-reason"
                placeholder="Nhập lý do xin nghỉ..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="resize-none rounded-xl border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* iOS-style Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setCreateSheetOpen(false)}
                className="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                variant="outline"
              >
                Hủy
              </Button>
              <Button
                onClick={addItem}
                disabled={!type || !startDate || !endDate || !reason}
                className="flex-1 h-12 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Gửi đơn
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
