import { SegmentedControl } from '@/components/base/SegmentedControl'
import { BottomCTA } from '@/components/base/BottomCTA'
import { Plus } from 'lucide-react'
import { useLeaves } from '@/hooks/leaves/useLeaves.ts'
import StatisticsCardsMobile from '@/components/Leaves/StatisticsCardsMobile.tsx'
import LeaveListMobile from '@/components/Leaves/LeaveListMobile.tsx'
import ViewDetailsSheetMobile from '@/components/Leaves/ViewDetailsSheetMobile.tsx'
import ConfirmationDialogMobile from '@/components/Leaves/ConfirmationDialogMobile.tsx'
import CreateLeaveSheetMobile from '@/components/Leaves/CreateLeaveSheetMobile.tsx'
import useGetLeavesList from '@/hooks/leaves/useGetLeavesList.ts'
import {
  type LeavesStatus,
  StatusLeaves,
  type LeavesListDataResponse,
  type LeaveFormValues,
} from '@/types/Leave.ts'
import { useState, useEffect } from 'react'
import { convertToDateInput } from '@/utils/CommonUtils.ts'

export default function LeavesMobile() {
  const {
    canApprove,
    selectedRequest,
    viewDialogOpen,
    setViewDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    actionType,
    filterStatus,
    setFilterStatus,
    handleActionClick,
    confirmAction,
    viewDetails,
  } = useLeaves()

  const [offset, setOffset] = useState(0)
  const [allItems, setAllItems] = useState<LeavesListDataResponse[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [editMode, setEditMode] = useState<'create' | 'update'>('create')
  const [editLeaveId, setEditLeaveId] = useState<number | undefined>(undefined)
  const [editInitialValues, setEditInitialValues] = useState<Partial<LeaveFormValues> | null>(null)
  const limit = 10

  const { absenceRequests, isFetching } = useGetLeavesList({
    statuses: filterStatus,
    offset,
    limit,
  })

  useEffect(() => {
    setOffset(0)
    setAllItems([])
    setHasMore(false)
  }, [filterStatus])

  useEffect(() => {
    if (absenceRequests) {
      if (offset === 0) {
        setAllItems(absenceRequests)
      } else {
        setAllItems((prev) => [...prev, ...absenceRequests])
      }
      setHasMore(absenceRequests.length === limit)
    } else if (offset === 0) {
      setAllItems([])
      setHasMore(false)
    }
  }, [absenceRequests, offset, limit])

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit)
  }

  const handleEditLeave = (request: LeavesListDataResponse) => {
    setEditMode('update')
    setEditLeaveId(request.id)
    setEditInitialValues({
      absenceType: request.absenceType,
      dayOffType: request.dayOffType,
      offFrom: convertToDateInput(request.offFrom),
      offTo: convertToDateInput(request.offTo),
      reason: request.reason,
      startDate: convertToDateInput(request.offFrom),
    })
    setCreateDialogOpen(true)
  }

  const handleCreateClick = () => {
    setEditMode('create')
    setEditLeaveId(undefined)
    setEditInitialValues(null)
    setCreateDialogOpen(true)
  }

  const handleSheetClose = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      // Reset edit state when closing
      setEditMode('create')
      setEditLeaveId(undefined)
      setEditInitialValues(null)
    }
  }

  return (
    <div className="flex flex-col h-screen dark:bg-gray-950">
      <StatisticsCardsMobile />

      <div className="px-4 pb-2">
        <SegmentedControl
          options={[
            {
              label: 'Tất cả',
              value: [StatusLeaves.APPROVED, StatusLeaves.PENDING, StatusLeaves.REJECTED],
            },
            { label: 'Chờ duyệt', value: [StatusLeaves.PENDING] },
            { label: 'Đã duyệt', value: [StatusLeaves.APPROVED] },
          ]}
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as LeavesStatus[])}
        />
      </div>

      {/* iOS-style List */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <LeaveListMobile
          items={allItems}
          canApprove={canApprove}
          onViewDetails={viewDetails}
          onActionClick={handleActionClick}
          onCreateClick={handleCreateClick}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isFetching}
        />
      </div>

      {/* Fixed Bottom CTA - pill style (above bottom nav) */}
      <BottomCTA
        visible={!(createDialogOpen || viewDialogOpen || confirmDialogOpen)}
        onClick={handleCreateClick}
        label="Tạo đơn xin nghỉ"
        icon={<Plus className="size-4" />}
        bottomOffsetClassName="bottom-22"
      />

      {/* View Details BottomSheet */}
      <ViewDetailsSheetMobile
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        selectedRequest={selectedRequest}
        onEdit={handleEditLeave}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialogMobile
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        actionType={actionType}
        onConfirm={confirmAction}
      />

      {/* Create/Update Leave Request BottomSheet */}
      <CreateLeaveSheetMobile
        open={createDialogOpen}
        onOpenChange={handleSheetClose}
        mode={editMode}
        leaveId={editLeaveId}
        initialValues={editInitialValues}
      />
    </div>
  )
}
