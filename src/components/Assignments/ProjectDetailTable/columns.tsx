import { Badge } from '@/components/ui/badge'
import { type ColumnType } from '@/components/base/DataTable'

export type TaskRow = {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done' | 'blocked'
  assigneeId?: string
  estimateHours?: number
}

export const STATUS_LABEL: Record<TaskRow['status'], string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
}

export const taskColumns = (assigneeIdToName?: Record<string, string>): ColumnType<TaskRow>[] => [
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
    sorter: true,
    filterable: true,
    filterType: 'text',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    filterable: true,
    filterType: 'text',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: STATUS_LABEL.todo, value: 'todo' },
      { label: STATUS_LABEL.in_progress, value: 'in_progress' },
      { label: STATUS_LABEL.done, value: 'done' },
      { label: STATUS_LABEL.blocked, value: 'blocked' },
    ],
    render: (value) => {
      const map: Record<
        string,
        { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
      > = {
        todo: { label: STATUS_LABEL.todo, variant: 'secondary' },
        in_progress: { label: STATUS_LABEL.in_progress, variant: 'outline' },
        done: { label: STATUS_LABEL.done, variant: 'default' },
        blocked: { label: STATUS_LABEL.blocked, variant: 'destructive' },
      }
      const cfg = map[value as string]
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
  },
  {
    title: 'Người phụ trách',
    dataIndex: 'assigneeId',
    key: 'assigneeId',
    filterable: true,
    filterType: 'text',
    render: (value) => assigneeIdToName?.[value as string] || value || '-',
  },
  {
    title: 'Ước lượng (giờ)',
    dataIndex: 'estimateHours',
    key: 'estimateHours',
    sorter: true,
    align: 'right',
    render: (value) => value ?? '-',
  },
]
