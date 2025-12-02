import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { STATUS_LABEL } from '@/components/Assignments/ProjectDetailTable/columns'
import type { TaskRow } from '@/components/Assignments/ProjectDetailTable/columns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pencil, Check, X } from 'lucide-react'
import { useGetDetailTask } from '@/hooks/assignments/useGetDetailTask'
import { CommentTask } from '@/components/Task/CommentTask'
import { SidebarTask } from '@/components/Task/SidebarTask'
import CreateTaskModal from '@/components/Assignments/CreateTaskModal'
import { BottomSheetTask } from '@/components/Task/BottomSheet'

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
    priority: 1,
    taskType: 1,
  },
  {
    id: 't2',
    title: 'Xây dựng tính năng quét mã vạch',
    description: 'Phát triển chức năng quét mã vạch để nhập xuất hàng nhanh chóng',
    status: 'todo',
    assigneeId: 'u2',
    estimateHours: 3,
    priority: 1,
    taskType: 1,
  },
  {
    id: 't3',
    title: 'Tích hợp báo cáo tồn kho',
    description: 'Xây dựng màn hình báo cáo tồn kho, lịch sử xuất nhập và thống kê',
    status: 'cancel',
    assigneeId: 'u2',
    estimateHours: 2,
    priority: 1,
    taskType: 1,
  },
]

export const DetailTask = () => {
  const { id } = useParams()
  const { projectAssignmentDetail } = useGetDetailTask(Number(id))
  console.log(projectAssignmentDetail, 'projectAssignmentDetail')
  const [editOpen, setEditOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [task, setTask] = useState(MOCK_TASKS.find((t) => t.id === id) || MOCK_TASKS[0])
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.description || '')
  const [isHoveringDescription, setIsHoveringDescription] = useState(false)

  const assignee = useMemo(() => MOCK_USERS.find((u) => u.id === task?.assigneeId), [task])
  const assigner = MOCK_USERS[2]

  function handleSaveTask(update: Partial<TaskRow>) {
    if (!task) return
    setTask((prev) => ({ ...prev!, ...update }))
  }

  const handleSaveDescription = () => {
    // TODO: Call API to update description
    console.log('Updating description:', editedDescription)
    setTask((prev) => ({ ...prev!, description: editedDescription }))
    setIsEditingDescription(false)
  }

  const handleCancelEdit = () => {
    setEditedDescription(task.description || '')
    setIsEditingDescription(false)
  }

  const handleStartEdit = () => {
    setEditedDescription(task.description || '')
    setIsEditingDescription(true)
  }

  if (!task) return <div className="text-center pt-20 text-2xl text-gray-400">Task not found.</div>

  return (
    <div className="min-h-screen">
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

            {/* Main Task Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                {/* Title and Edit Button */}
                <div className="flex items-start justify-between gap-4 mb-6">
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

                {/* Description Section */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsHoveringDescription(true)}
                  onMouseLeave={() => setIsHoveringDescription(false)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Mô tả</h3>
                    {!isEditingDescription && isHoveringDescription && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleStartEdit}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Chỉnh sửa
                      </Button>
                    )}
                  </div>

                  {isEditingDescription ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="min-h-[120px] resize-none"
                        placeholder="Nhập mô tả công việc..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveDescription} className="h-8">
                          <Check className="w-4 h-4 mr-1" />
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="h-8"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-gray-700 leading-relaxed prose max-w-none cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                      onClick={handleStartEdit}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            task.description ||
                            "<span class='italic text-gray-400'>Chưa có mô tả - Click để thêm</span>",
                        }}
                      />
                    </div>
                  )}
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
      <BottomSheetTask
        infoOpen={infoOpen}
        setInfoOpen={setInfoOpen}
        task={task}
        assignee={assignee}
        assigner={assigner}
      />
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
