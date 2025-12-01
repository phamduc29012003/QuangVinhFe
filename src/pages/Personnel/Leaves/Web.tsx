import { Button } from '@/components/ui/button.tsx'
import { Calendar, Plus } from 'lucide-react'
import { useLeaves } from '@/hooks/leaves/useLeaves.ts'
import LeavesTable from '@/components/Leaves/LeavesTable.tsx'
import StatisticsCards from '@/components/Leaves/StatisticsCards.tsx'
import ViewDetailsDialog from '@/components/Leaves/ViewDetailsDialog.tsx'
import ConfirmationDialog from '@/components/Leaves/ConfirmationDialog.tsx'
import CreateLeaveDialog from '@/components/Leaves/CreateLeaveDialog.tsx'
import useGetLeavesList from '@/hooks/leaves/useGetLeavesList.ts'
import { StatusLeaves } from '@/types/Leave.ts'

export default function LeavesWeb() {
  const {
    requests,
    canApprove,
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
    selectedRequest,
    viewDialogOpen,
    setViewDialogOpen,
    confirmDialogOpen,
    setConfirmDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    actionType,
    handleActionClick,
    confirmAction,
    viewDetails,
    handleCreateLeave,
  } = useLeaves()

  const { absenceRequests, statuses } = useGetLeavesList({
    statuses: [StatusLeaves.APPROVED, StatusLeaves.PENDING, StatusLeaves.REJECTED],
    offset: 0,
    limit: 10,
  })

  console.log('absenceRequests', absenceRequests)
  console.log('statuses', statuses)

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
      <StatisticsCards requests={requests} />
      <LeavesTable
        data={requests}
        canApprove={canApprove}
        onActionClick={handleActionClick}
        onViewDetails={viewDetails}
      />
      {/* View Details Dialog */}
      <ViewDetailsDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        selectedRequest={selectedRequest}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        actionType={actionType}
        onConfirm={confirmAction}
      />

      {/* Create Leave Request Dialog */}
      <CreateLeaveDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        type={type}
        setType={setType}
        leaveMode={leaveMode}
        setLeaveMode={setLeaveMode}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        reason={reason}
        setReason={setReason}
        onSubmit={handleCreateLeave}
      />
    </div>
  )
}
