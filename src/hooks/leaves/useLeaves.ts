import { useAuthStore } from '@/stores'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  type LeaveSession,
  type LeavesListDataResponse,
  type LeavesStatus,
  LeavesType,
  StatusLeaves,
} from '@/types/Leave.ts'

export function useLeaves() {
  const { user } = useAuthStore()
  const roles = user?.roles || []
  const canApprove = roles.includes('DIRECTOR') || roles.includes('MANAGER')

  const [requests, setRequests] = useState<LeavesListDataResponse[]>([])

  const [type, setType] = useState<LeavesType | ''>('')
  const [leaveMode, setLeaveMode] = useState<'AM' | 'PM' | 'FULL' | 'RANGE' | ''>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [session, setSession] = useState<LeaveSession>('FULL')
  const [reason, setReason] = useState<string>('')

  const [selectedRequest, setSelectedRequest] = useState<LeavesListDataResponse | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [actionRequestId, setActionRequestId] = useState<string | null>(null)

  const [filterStatus, setFilterStatus] = useState<LeavesStatus[]>([
    StatusLeaves.PENDING,
    StatusLeaves.APPROVED,
    StatusLeaves.REJECTED,
  ])

  const resetForm = useCallback(() => {
    setType('')
    setLeaveMode('')
    setStartDate('')
    setEndDate('')
    setSession('FULL')
    setReason('')
  }, [])

  const addRequest = useCallback((request: LeavesListDataResponse) => {
    setRequests((prev) => [...prev, request as any])
  }, [])

  const validateForm = useCallback(() => {
    if (!type) {
      toast.error('Vui lòng chọn loại nghỉ')
      return false
    }
    if (!leaveMode) {
      toast.error('Vui lòng chọn chế độ nghỉ')
      return false
    }
    if (!startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu')
      return false
    }
    if (leaveMode === 'RANGE' && !endDate) {
      toast.error('Vui lòng chọn ngày kết thúc')
      return false
    }
    if (leaveMode === 'RANGE' && new Date(startDate) > new Date(endDate)) {
      toast.error('Ngày bắt đầu không thể sau ngày kết thúc')
      return false
    }
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do xin nghỉ')
      return false
    }
    return true
  }, [type, leaveMode, startDate, endDate, reason])

  const handleCreateLeave = useCallback(() => {
    if (!validateForm()) return

    setCreateDialogOpen(false)
    resetForm()
  }, [validateForm, type, leaveMode, startDate, endDate, reason, user?.name, addRequest, resetForm])

  const handleActionClick = useCallback((id: string, action: 'approve' | 'reject') => {
    setActionRequestId(id)
    setActionType(action)
    setConfirmDialogOpen(true)
  }, [])

  const confirmAction = useCallback(() => {
    if (!actionRequestId || !actionType) return

    if (actionType === 'approve') {
      toast.success('Đã duyệt đơn!')
    } else {
      toast.error('Đã từ chối đơn!')
    }

    setConfirmDialogOpen(false)
    setActionRequestId(null)
    setActionType(null)
  }, [actionRequestId, actionType])

  const viewDetails = useCallback((request: LeavesListDataResponse) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }, [])

  const countStatus = (dataLeaves: LeavesListDataResponse[]) => {
    return dataLeaves.reduce(
      (acc, item) => {
        acc.total += 1

        if (item.status === StatusLeaves.APPROVED) acc.approved += 1
        if (item.status === StatusLeaves.PENDING) acc.pending += 1
        if (item.status === StatusLeaves.REJECTED) acc.rejected += 1

        return acc
      },
      {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
      }
    )
  }

  return {
    countStatus,
    requests,
    setRequests,
    canApprove,
    type,
    setType,
    leaveMode,
    setLeaveMode,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    session,
    setSession,
    reason,
    setReason,
    selectedRequest,
    setSelectedRequest,
    viewDialogOpen,
    setViewDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    actionType,
    actionRequestId,
    filterStatus,
    setFilterStatus,
    handleCreateLeave,
    handleActionClick,
    confirmAction,
    viewDetails,
    validateForm,
  }
}
