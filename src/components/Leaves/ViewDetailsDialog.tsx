import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Eye, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { getLeaveIcon, type LeaveRequest } from '@/types/Leave.ts'
import { calculateDays, formatDate } from '@/utils/CommonUtils.ts'

type ViewDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedRequest: LeaveRequest | null
}

export default function ViewDetailsDialog({
  open,
  onOpenChange,
  selectedRequest,
}: ViewDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  )
}
