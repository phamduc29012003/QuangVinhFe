import React from 'react'
import { Card } from '@/components/ui/card.tsx'
import { AlertCircle, Briefcase, CheckCircle2, Clock, Eye, XCircle } from 'lucide-react'
import { type ColumnType, TableBase } from '@/components/base/DataTable'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { calculateDays, formatDate } from '@/utils/CommonUtils.ts'
import { getLeaveIcon, type LeaveRequest, type LeaveType } from '@/types/Leave.ts'

type LeavesTableProps = {
  data: LeaveRequest[]
  canApprove: boolean
  onActionClick: (id: string, action: 'approve' | 'reject') => void
  onViewDetails: (request: LeaveRequest) => void
}

const LeavesTable: React.FC<LeavesTableProps> = (props) => {
  const { data, canApprove, onActionClick, onViewDetails } = props

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
          <Button variant="ghost" size="sm" onClick={() => onViewDetails(record)}>
            <Eye className="size-4" />
          </Button>
          {canApprove && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onActionClick(record.id, 'approve')}
                disabled={record.status !== 'pending'}
                className="gap-1.5"
              >
                <CheckCircle2 className="size-3.5" />
                Duyệt
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onActionClick(record.id, 'reject')}
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
    <>
      {/* Leave Requests Table */}
      <Card className="p-6 rounded-xl border-muted shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="size-5" />
            Danh sách đơn xin nghỉ
          </h2>
        </div>

        <TableBase
          dataSource={data}
          columns={columns}
          searchable={true}
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
          filterable={true}
          columnVisibility={true}
          rowKey="id"
          pagination={{
            current: 1,
            pageSize: 10,
            total: data.length,
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
    </>
  )
}
export default LeavesTable
