import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import type { IProjectAssignment } from '@/types/Assignment'

interface AssignmentsSheetProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: IProjectAssignment) => void
  isSubmitting?: boolean
}

export const AssignmentsSheet = ({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
}: AssignmentsSheetProps) => {
  const { register, handleSubmit, reset } = useForm<IProjectAssignment>()

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
        <form className="mt-6 space-y-4  mx-4 " onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('name', { required: true })} placeholder="Tên dự án" />
          <Input {...register('description')} placeholder="Mô tả" />
          <Input {...register('value')} placeholder="Giá trị/Trạng thái" />
          <div className="flex justify-end gap-2">
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
