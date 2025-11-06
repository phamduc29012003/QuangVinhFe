import { useState } from 'react'
import { Card } from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
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
import { TableBase, type ColumnType } from '@/components/base/DataTable'
import {
  Calendar,
  Umbrella,
  Heart,
  Baby,
  Plane,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Plus,
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

type LeaveSession = 'FULL' | 'AM' | 'PM'

type LeaveRequest = {
  id: string
  employeeName: string
  type: LeaveType
  startDate: string
  endDate: string
  session?: LeaveSession // áp dụng khi xin nghỉ 1 ngày
  reason: string
  status: LeaveStatus
  createdAt: string
}

const initialData: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Nguyễn Văn A',
    type: 'Nghỉ phép năm',
    startDate: '2025-10-30',
    endDate: '2025-11-01',
    reason: 'Về quê có việc gia đình',
    status: 'pending',
    createdAt: '2025-10-28T10:00:00',
  },
  {
    id: '2',
    employeeName: 'Trần Thị B',
    type: 'Nghỉ ốm',
    startDate: '2025-10-29',
    endDate: '2025-10-29',
    reason: 'Cảm cúm',
    status: 'approved',
    createdAt: '2025-10-27T14:30:00',
  },
  {
    id: '3',
    employeeName: 'Lê Văn C',
    type: 'Nghỉ thai sản',
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    reason: 'Nghỉ sinh con',
    status: 'approved',
    createdAt: '2025-10-20T09:00:00',
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

export default function LeavesWeb() {
  const { user } = useAuthStore()
  const roles = user?.roles || []
  const canApprove = roles.includes('DIRECTOR') || roles.includes('MANAGER')
  const [requests, setRequests] = useState<LeaveRequest[]>(initialData)
  const [type, setType] = useState<LeaveType | ''>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [session, setSession] = useState<LeaveSession>('FULL')
  const [reason, setReason] = useState<string>('')
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [actionRequestId, setActionRequestId] = useState<string | null>(null)

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

  function submitNewRequest() {
    if (!validateForm()) return

    const newItem: LeaveRequest = {
      id: String(Date.now()),
      employeeName: 'Bạn',
      type: type as LeaveType,
      startDate,
      endDate,
      session:
        new Date(startDate).toDateString() === new Date(endDate).toDateString() ? session : 'FULL',
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setRequests((prev) => [newItem, ...prev])
    setType('')
    setStartDate('')
    setEndDate('')
    setSession('FULL')
    setReason('')
    setCreateDialogOpen(false)

    let days = calculateDays(startDate, endDate)
    if (days === 1 && session !== 'FULL') days = 0.5
    toast.success('Tạo đơn thành công!', {
      description: `Đơn xin nghỉ ${days} ngày đã được gửi và đang chờ duyệt`,
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
    setRequests((prev) => prev.map((r) => (r.id === actionRequestId ? { ...r, status } : r)))

    const request = requests.find((r) => r.id === actionRequestId)
    if (request) {
      if (actionType === 'approve') {
        toast.success('Đã duyệt đơn!', {
          description: `Đơn xin nghỉ của ${request.employeeName} đã được phê duyệt`,
        })
      } else {
        toast.error('Đã từ chối đơn!', {
          description: `Đơn xin nghỉ của ${request.employeeName} đã bị từ chối`,
        })
      }
    }

    setConfirmDialogOpen(false)
    setActionRequestId(null)
    setActionType(null)
  }

  function viewDetails(request: LeaveRequest) {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  }

  const columns: ColumnType<LeaveRequest>[] = [
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: true,
      filterable: true,
      filterType: 'text',
      render: (value) => <div className="font-medium">{value}</div>,
    },
    {
      title: 'Loại nghỉ',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Nghỉ phép năm', value: 'Nghỉ phép năm' },
        { label: 'Nghỉ ốm', value: 'Nghỉ ốm' },
        { label: 'Nghỉ không lương', value: 'Nghỉ không lương' },
        { label: 'Nghỉ thai sản', value: 'Nghỉ thai sản' },
        { label: 'Nghỉ hiếu', value: 'Nghỉ hiếu' },
        { label: 'Nghỉ cưới', value: 'Nghỉ cưới' },
      ],
      render: (value: LeaveType) => {
        const Icon = getLeaveIcon(value)
        return (
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
            <span>{value}</span>
          </div>
        )
      },
    },
    {
      title: 'Từ ngày',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      filterable: true,
      filterType: 'date',
      render: (value) => formatDate(value),
    },
    {
      title: 'Đến ngày',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: true,
      filterable: true,
      filterType: 'date',
      render: (value) => formatDate(value),
    },
    {
      title: 'Số ngày',
      dataIndex: 'days',
      key: 'days',
      sorter: true,
      render: (_, record) => {
        const days = calculateDays(record.startDate, record.endDate)
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            <span className="font-medium">{days} ngày</span>
          </div>
        )
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (value) => (
        <div className="max-w-[200px] truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Chờ duyệt', value: 'pending' },
        { label: 'Đã duyệt', value: 'approved' },
        { label: 'Từ chối', value: 'rejected' },
      ],
      render: (value) => {
        if (value === 'pending')
          return (
            <Badge variant="secondary" className="gap-1.5">
              <AlertCircle className="size-3" />
              Chờ duyệt
            </Badge>
          )
        if (value === 'approved')
          return (
            <Badge className="gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
              <CheckCircle2 className="size-3" />
              Đã duyệt
            </Badge>
          )
        if (value === 'rejected')
          return (
            <Badge className="gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0">
              <XCircle className="size-3" />
              Từ chối
            </Badge>
          )
        return null
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'left',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => viewDetails(record)}>
            <Eye className="size-4" />
          </Button>
          {canApprove && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActionClick(record.id, 'approve')}
                disabled={record.status !== 'pending'}
                className="gap-1.5"
              >
                <CheckCircle2 className="size-3.5" />
                Duyệt
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleActionClick(record.id, 'reject')}
                disabled={record.status !== 'pending'}
                className="gap-1.5"
              >
                <XCircle className="size-3.5" />
                Từ chối
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <Calendar className="size-7" />
          Quản lý nghỉ phép
        </h1>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 h-10 px-4">
          <Plus className="size-4" />
          Tạo đơn xin nghỉ
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-medium">
                Tổng đơn
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
            </div>
            <Calendar className="size-9 text-blue-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400 font-medium">
                Chờ duyệt
              </p>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                {stats.pending}
              </p>
            </div>
            <AlertCircle className="size-9 text-amber-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400 font-medium">
                Đã duyệt
              </p>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                {stats.approved}
              </p>
            </div>
            <CheckCircle2 className="size-9 text-emerald-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-5 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-400 font-medium">
                Từ chối
              </p>
              <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="size-9 text-rose-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card className="p-6 rounded-xl border-muted shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="size-5" />
            Danh sách đơn xin nghỉ
          </h2>
        </div>

        <TableBase
          dataSource={requests}
          columns={columns}
          searchable={true}
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          filterable={true}
          columnVisibility={true}
          rowKey="id"
          pagination={{
            current: 1,
            pageSize: 10,
            total: requests.length,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} mục`,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          size="middle"
          bordered={true}
          striped
          emptyText="Chưa có đơn xin nghỉ nào"
        />
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl" animationVariant="fade">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-5" />
              Chi tiết đơn xin nghỉ
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn xin nghỉ</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nhân viên</Label>
                  <p className="font-medium">{selectedRequest.employeeName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Loại nghỉ</Label>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = getLeaveIcon(selectedRequest.type)
                      return <Icon className="size-4 text-muted-foreground" />
                    })()}
                    <p className="font-medium">{selectedRequest.type}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Từ ngày</Label>
                  <p className="font-medium">{formatDate(selectedRequest.startDate)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Đến ngày</Label>
                  <p className="font-medium">{formatDate(selectedRequest.endDate)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Số ngày nghỉ</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <p className="font-medium">
                      {calculateDays(selectedRequest.startDate, selectedRequest.endDate)} ngày
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div>
                    {selectedRequest.status === 'pending' && (
                      <Badge variant="secondary" className="gap-1.5">
                        <AlertCircle className="size-3" />
                        Chờ duyệt
                      </Badge>
                    )}
                    {selectedRequest.status === 'approved' && (
                      <Badge className="gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                        <CheckCircle2 className="size-3" />
                        Đã duyệt
                      </Badge>
                    )}
                    {selectedRequest.status === 'rejected' && (
                      <Badge className="gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0">
                        <XCircle className="size-3" />
                        Từ chối
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Lý do</Label>
                <p className="text-sm bg-muted/50 p-3 rounded-md">{selectedRequest.reason}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Ngày tạo</Label>
                <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Xác nhận duyệt đơn' : 'Xác nhận từ chối đơn'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve'
                ? 'Bạn có chắc chắn muốn duyệt đơn xin nghỉ này không?'
                : 'Bạn có chắc chắn muốn từ chối đơn xin nghỉ này không?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Leave Request Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl" animationVariant="fade">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-5" />
              Tạo đơn xin nghỉ
            </DialogTitle>
            <DialogDescription>Điền thông tin để tạo đơn xin nghỉ mới</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type">
                Loại nghỉ <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as LeaveType)}>
                <SelectTrigger id="leave-type" className="w-full">
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

            <div className="space-y-2">
              <Label htmlFor="start-date">
                Từ ngày <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">
                Đến ngày <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Theo buổi - áp dụng khi nghỉ 1 ngày */}
            <div className="space-y-2">
              <Label htmlFor="session">Theo buổi</Label>
              <Select value={session} onValueChange={(v) => setSession(v as any)}>
                <SelectTrigger id="session" className="w-full">
                  <SelectValue placeholder="Cả ngày / Buổi sáng / Buổi chiều" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL">Cả ngày</SelectItem>
                  <SelectItem value="AM">Buổi sáng</SelectItem>
                  <SelectItem value="PM">Buổi chiều</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Chỉ áp dụng khi xin nghỉ trong 1 ngày.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Số ngày nghỉ</Label>
              <div className="flex items-center gap-2 h-9 px-3 rounded-md border bg-muted/50">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium">
                  {startDate && endDate
                    ? `${calculateDays(startDate, endDate) === 1 && session !== 'FULL' ? 0.5 : calculateDays(startDate, endDate)} ngày`
                    : '0 ngày'}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="reason">
                Lý do xin nghỉ <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Nhập lý do xin nghỉ..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="h-10 px-4"
              >
                Hủy
              </Button>
              <Button className="gap-2 h-10 px-4" onClick={submitNewRequest}>
                <CheckCircle2 className="size-4" />
                Gửi đơn xin nghỉ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
