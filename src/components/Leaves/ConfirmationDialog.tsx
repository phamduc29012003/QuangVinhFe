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

type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType: 'approve' | 'reject' | null
  onConfirm: () => void
}

export default function ConfirmationDialog({
  open,
  onOpenChange,
  actionType,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={onConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
