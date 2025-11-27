import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from '@/schemas'
import type { IProject } from '@/types/project'
import { FormSelect } from '../ui/selectDropwdown'
import { STATUS_PROJECT, PRIVACY } from '@/constants/assignments/privacy'

interface AssignmentsSheetProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: IProject) => void
  isSubmitting?: boolean
}

// Convert constants to select options
const statusOptions = Object.entries(STATUS_PROJECT).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' '),
}))

const privacyOptions = Object.entries(PRIVACY).map(([key, value]) => ({
  value,
  label: key,
}))

export const AssignmentsSheet = ({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
}: AssignmentsSheetProps) => {
  const { register, handleSubmit, reset, control } = useForm<IProject>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      status: 1,
      privacy: 1,
    },
  })

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Tạo dự án mới</SheetTitle>
        </SheetHeader>
        <form className="mt-6 space-y-4 mx-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Tên dự án */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên dự án</label>
            <Input {...register('name')} placeholder="Nhập tên dự án" />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <FormSelect
              control={control}
              name="status"
              placeholder="Chọn trạng thái"
              options={statusOptions}
              className="w-full"
            />
          </div>

          {/* Privacy */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quyền riêng tư</label>
            <FormSelect
              control={control}
              name="privacy"
              placeholder="Chọn quyền riêng tư"
              options={privacyOptions}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={!!isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default AssignmentsSheet
