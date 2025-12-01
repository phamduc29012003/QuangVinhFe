import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { STATUS_LABEL } from '@/components/Assignments/ProjectDetailTable/columns'
import type { TaskRow } from '@/components/Assignments/ProjectDetailTable/columns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import BottomSheet from '@/components/ui/bottom-sheet'
import { Clock4, Calendar, UserPlus2, Pencil } from 'lucide-react'
import { useGetDetailTask } from '@/hooks/assignments/useGetDetailTask'
import { CommentTask } from '@/components/Task/CommentTask'
import { SidebarTask } from '@/components/Task/SidebarTask'
import CreateTaskModal from '@/components/Assignments/CreateTaskModal'

const MOCK_USERS = [
  { id: 'u1', name: 'Alice', avatar: '/photo_2025-09-26_12-28-52 (2).jpg' },
  { id: 'u2', name: 'Bob', avatar: '/photo_2025-09-26_12-28-52 (3).jpg' },
  { id: 'u3', name: 'Charlie', avatar: '/photo_2025-09-26_12-28-54.jpg' },
]
const MOCK_TASKS: TaskRow[] = [
  {
    id: 't1',
    title: 'Thiết kế giao diện quản lý nhập xuất kho',
    description: 'Thiết kế màn hình nhập xuất hàng, theo dõi tồn kho và quản lý sản phẩm',
    status: 'in_progress',
    assigneeId: 'u1',
    estimateHours: 8,
  },
  {
    id: 't2',
    title: 'Xây dựng tính năng quét mã vạch',
    description: 'Phát triển chức năng quét mã vạch để nhập xuất hàng nhanh chóng',
    status: 'todo',
    assigneeId: 'u2',
    estimateHours: 3,
  },
  {
    id: 't3',
    title: 'Tích hợp báo cáo tồn kho',
    description: 'Xây dựng màn hình báo cáo tồn kho, lịch sử xuất nhập và thống kê',
    status: 'cancel',
    assigneeId: 'u2',
    estimateHours: 2,
  },
]

export const DetailTask = () => {
  const { id } = useParams()
  const { projectAssignmentDetail } = useGetDetailTask(Number(id))
  console.log(projectAssignmentDetail, 'projectAssignmentDetail')
  const [editOpen, setEditOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [task, setTask] = useState(MOCK_TASKS.find((t) => t.id === id) || MOCK_TASKS[0])
  const assignee = useMemo(() => MOCK_USERS.find((u) => u.id === task?.assigneeId), [task])
  const assigner = MOCK_USERS[2]

  function handleSaveTask(update: Partial<TaskRow>) {
    if (!task) return
    setTask((prev) => ({ ...prev!, ...update }))
  }

  if (!task) return <div className="text-center pt-20 text-2xl text-gray-400">Task not found.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mobile compact info bar */}
            <div className="lg:hidden">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback>{assignee?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500">Người được giao</div>
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {assignee?.name || 'Chưa gán'}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setInfoOpen(true)}>
                      Chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Header Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex-1">
                    {task.title}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 hover:bg-gray-100 rounded-full"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>

                {/* <Badge className={`${statusColor[task.status]} border font-medium px-3 py-1`}>
                  {STATUS_LABEL[task.status]}
                </Badge> */}
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Mô tả</h3>
                <div className="text-gray-700 leading-relaxed prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        task.description ||
                        "<span class='italic text-gray-400'>Không có mô tả</span>",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Comments Card */}
            <CommentTask />
          </div>

          {/* Sidebar */}
          <SidebarTask />
        </div>
      </div>

      {/* Mobile detail sheet */}
      <BottomSheet
        open={infoOpen}
        onOpenChange={setInfoOpen}
        title="Thông tin công việc"
        padded={false}
        contentClassName="rounded-t-2xl p-0"
      >
        <div className="p-6 space-y-4">
          {/* Assignee */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <UserPlus2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-0.5">Người được giao</div>
              <div className="font-medium text-sm text-gray-900 truncate">
                {assignee?.name || <span className="text-gray-400">Chưa gán</span>}
              </div>
            </div>
          </div>

          {/* Assigner */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              {/* <UserCircle2 className="w-4 h-4 text-purple-600" /> */}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-0.5">Người giao</div>
              <div className="font-medium text-sm text-gray-900">{assigner.name}</div>
            </div>
          </div>

          {/* Estimate */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Clock4 className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-0.5">Ước lượng</div>
              <div className="font-medium text-sm text-gray-900">
                {task.estimateHours ? `${task.estimateHours} giờ` : '-'}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  task.status === 'done'
                    ? 'bg-green-500'
                    : task.status === 'cancel'
                      ? 'bg-red-500'
                      : task.status === 'in_progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-0.5">Trạng thái</div>
              <div className="font-medium text-sm text-gray-900">{STATUS_LABEL[task.status]}</div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Created Date */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-0.5">Ngày tạo</div>
              <div className="font-medium text-sm text-gray-900">
                {new Date('2025-10-29T09:30:00Z').toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {/* Updated Date */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-0.5">Cập nhật</div>
              <div className="font-medium text-sm text-gray-900">
                {new Date('2025-10-29T13:15:00Z').toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>

      <CreateTaskModal
        open={editOpen}
        onOpenChange={setEditOpen}
        memberTask={MOCK_USERS.map((u) => ({ id: Number(u.id), name: u.name, email: '' }))}
        onCreate={(data) => {
          handleSaveTask({
            title: data.description,
            description: data.description, // Note: CreateTaskModal uses description as title currently, mapping might need adjustment if fields differ
            estimateHours: (data.estimateTime - (data.startTime || 0)) / (1000 * 60 * 60), // Rough estimate conversion or just use direct field if available
            status: (Object.keys(STATUS_LABEL).find(
              (key) =>
                STATUS_LABEL[key as keyof typeof STATUS_LABEL] ===
                STATUS_LABEL[data.status as unknown as keyof typeof STATUS_LABEL]
            ) || 'todo') as any,
            assigneeId: data.assignee?.id ? String(data.assignee.id) : undefined,
          })
          setEditOpen(false)
        }}
        mode="edit"
        initialData={{
          description: task.title, // Mapping title to description as per CreateTaskModal structure
          priority: 2, // Default or map from task if available
          taskType: 1, // Default or map from task if available
          estimateTime: new Date().getTime() + (task.estimateHours || 0) * 3600000, // Reverse calc or mock
          status: 1, // Map status string to number
          assignee: assignee ? { id: Number(assignee.id), name: assignee.name } : undefined,
          startTime: new Date().getTime(), // Mock
        }}
        groupId={1} // Mock group ID
      />
    </div>
  )
}
