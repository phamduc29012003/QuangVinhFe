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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
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
  Sun,
  Sunset,
  CalendarRange,
} from 'lucide-react'
import { LeavesType } from '@/types/Leave.ts'
// import { calculateDays } from '@/utils/CommonUtils.ts'
import { cn } from '@/lib/utils'

type CreateLeaveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: LeavesType | ''
  setType: (type: LeavesType | '') => void
  leaveMode: 'AM' | 'PM' | 'FULL' | 'RANGE' | ''
  setLeaveMode: (mode: 'AM' | 'PM' | 'FULL' | 'RANGE' | '') => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  reason: string
  setReason: (reason: string) => void
  onSubmit: () => void
}

export default function CreateLeaveDialog({
  open,
  onOpenChange,
  type,
  setType,
  leaveMode,
  setLeaveMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reason,
  setReason,
  onSubmit,
}: CreateLeaveDialogProps) {
  const leaveModeOptions = [
    { value: 'AM', label: 'Buổi sáng', icon: Sun },
    { value: 'PM', label: 'Buổi chiều', icon: Sunset },
    { value: 'FULL', label: 'Cả ngày', icon: Calendar },
    { value: 'RANGE', label: 'Nghỉ theo ngày', icon: CalendarRange },
  ] as const

  // const calculateLeaveDays = () => {
  //   if (!startDate) return 0
  //   if (leaveMode === 'RANGE' && endDate) {
  //     return calculateDays(startDate, endDate)
  //   }
  //   if (leaveMode === 'AM' || leaveMode === 'PM') return 0.5
  //   if (leaveMode === 'FULL') return 1
  //   return 0
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" animationVariant="fade">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5" />
            Tạo đơn xin nghỉ
          </DialogTitle>
          <DialogDescription>Điền thông tin để tạo đơn xin nghỉ mới</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loại nghỉ */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="leave-type">
              Loại nghỉ <span className="text-destructive">*</span>
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as LeavesType)}>
              <SelectTrigger id="leave-type" className="w-full">
                <SelectValue placeholder="Chọn loại nghỉ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LeavesType.SPECIAL.toString()}>
                  <div className="flex items-center gap-2">
                    <Plane className="size-4" />
                    Đặc biệt (Cưới, Tang, Thai Sản, Sinh Nhật)
                  </div>
                </SelectItem>
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

          {/* Chế độ nghỉ */}
          <div className="md:col-span-2 space-y-2">
            <Label>
              Chế độ nghỉ <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {leaveModeOptions.map((option) => {
                const Icon = option.icon
                const isActive = leaveMode === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLeaveMode(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      isActive
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-background hover:border-primary/50'
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date pickers - hiển thị theo chế độ nghỉ */}
          {leaveMode && (
            <>
              {leaveMode === 'RANGE' ? (
                <>
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
                      min={startDate}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="leave-date">
                    Ngày nghỉ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="leave-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {/* Số ngày nghỉ */}
          {leaveMode && startDate && (
            <div className="space-y-2">
              <Label>Số ngày nghỉ</Label>
              <div className="flex items-center gap-2 h-9 px-3 rounded-md border bg-muted/50">
                <Clock className="size-4 text-muted-foreground" />
                {/*<span className="font-medium">{calculateLeaveDays()} ngày</span>*/}
              </div>
            </div>
          )}

          {/* Lý do */}
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

          {/* Action buttons */}
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-4">
              Hủy
            </Button>
            <Button className="gap-2 h-10 px-4" onClick={onSubmit}>
              <CheckCircle2 className="size-4" />
              Gửi đơn xin nghỉ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
