import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import EditTaskModal from '@/components/Assignments/EditTaskModal'
import { STATUS_LABEL } from '@/components/Assignments/ProjectDetailTable/columns'
import type { TaskRow } from '@/components/Assignments/ProjectDetailTable/columns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  UserCircle2,
  Clock4,
  Calendar,
  UserPlus2,
  Pencil,
  MessageCircle,
  Send,
} from 'lucide-react'

const MOCK_USERS = [
  { id: 'u1', name: 'Alice', avatar: '' },
  { id: 'u2', name: 'Bob', avatar: '' },
  { id: 'u3', name: 'Charlie', avatar: '' },
]
const MOCK_TASKS: TaskRow[] = [
  {
    id: 't1',
    title: 'Create wireframes',
    description: 'Design initial wireframes for dashboard views',
    status: 'in_progress',
    assigneeId: 'u1',
    estimateHours: 8,
  },
  {
    id: 't2',
    title: 'Set up CI/CD',
    description: 'Add basic pipeline with build + lint',
    status: 'todo',
    assigneeId: 'u2',
    estimateHours: 3,
  },
  {
    id: 't3',
    title: 'Implement auth flow',
    description: 'Login, register and protected routes',
    status: 'blocked',
    assigneeId: 'u2',
    estimateHours: 2,
  },
]
const MOCK_COMMENTS = [
  {
    id: 'c1',
    userId: 'u3',
    userName: 'Charlie',
    content: 'Chỗ ước lượng t có thể làm nhanh hơn.',
    date: '2025-10-29T11:23:00Z',
  },
  {
    id: 'c2',
    userId: 'u1',
    userName: 'Alice',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T12:20:00Z',
  },
]

export const DetailTask = () => {
  const { id } = useParams()
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [commentInput, setCommentInput] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [task, setTask] = useState(MOCK_TASKS.find((t) => t.id === id) || MOCK_TASKS[0])
  const assignee = useMemo(() => MOCK_USERS.find((u) => u.id === task?.assigneeId), [task])
  const assigner = MOCK_USERS[2]
  function handleSaveTask(update: Partial<TaskRow>) {
    if (!task) return
    setTask((prev) => ({ ...prev!, ...update }))
  }
  function handleAddComment() {
    if (!commentInput.trim()) return
    setComments((prev) => [
      ...prev,
      {
        id: `c${Math.random().toString(36).slice(2, 8)}`,
        userId: assigner.id,
        userName: assigner.name,
        content: commentInput.trim(),
        date: new Date().toISOString(),
      },
    ])
    setCommentInput('')
  }
  if (!task) return <div className="text-center pt-20 text-2xl text-gray-400">Task not found.</div>
  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:gap-16 p-7 bg-white min-h-screen">
      {/* Main content left */}
      <div className="flex-1 max-w-2xl w-full">
        {/* Header Bar & Title */}
        <div className="flex items-center gap-2 mb-4 group">
          <Button variant="ghost" size="icon" className="rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Button>
          <span className="text-xs text-gray-400">Project / Task</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <h1 className="font-bold text-3xl text-black leading-tight flex items-center">
            {task.title}
          </h1>
          <Badge
            variant="outline"
            className="border px-3 py-1 text-[13px] rounded-full border-gray-200 text-gray-700 gap-1 bg-white font-normal"
          >
            <span
              className={
                task.status === 'done'
                  ? 'text-green-600'
                  : task.status === 'blocked'
                    ? 'text-red-600'
                    : task.status === 'in_progress'
                      ? 'text-blue-500'
                      : 'text-gray-400'
              }
            >
              ●
            </span>{' '}
            {STATUS_LABEL[task.status]}
          </Badge>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full border-gray-200 hover:border-black hover:bg-gray-100 transition-all"
            aria-label="Chỉnh sửa"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <Separator className="my-6" />
        {/* Description */}
        <div className="bg-neutral-50 rounded-lg px-6 py-5 mb-8 min-h-[48px] border border-gray-100 text-[15px] text-gray-800 prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html:
                task.description || "<span class='italic text-gray-300'>No description</span>",
            }}
          />
        </div>
        {/* Comments */}
        <div className="mb-2 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-400 mr-1" />
          <h4 className="font-semibold text-lg text-gray-700">Bình luận</h4>
        </div>
        <div className="flex flex-col gap-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <Avatar className="size-8 text-xs">
                <AvatarFallback>{c.userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{c.userName}</span>
                  <span className="text-gray-400 text-xs">
                    {new Date(c.date).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="text-[15px] text-gray-700">{c.content}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Comment input */}
        <div className="mt-3 flex items-end gap-2">
          <Textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Viết bình luận..."
            className="rounded-lg border-gray-200 bg-white text-base focus:ring-1 focus:ring-gray-200 resize-none min-h-10"
            rows={2}
          />
          <Button
            type="button"
            size="icon"
            className="rounded-full bg-black text-white hover:bg-gray-800"
            onClick={handleAddComment}
            disabled={!commentInput.trim()}
            aria-label="Gửi"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* Side Info Card right */}
      <aside className="w-full max-w-xs xl:sticky xl:top-16 flex-shrink-0">
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-none px-6 py-7">
          <CardTitle className="text-gray-400 text-base font-semibold mb-3 tracking-wide">
            Thông tin
          </CardTitle>
          <CardContent className="flex flex-col gap-3 px-0">
            <div className="flex items-center gap-3">
              <UserPlus2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-2">Người được giao</span>
              <span className="font-semibold text-base text-black ml-2">
                {assignee?.name || <span className="text-gray-300">Chưa gán</span>}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <UserCircle2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-2">Người giao</span>
              <span className="font-semibold text-base text-black ml-2">{assigner?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock4 className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-2">Ước lượng</span>
              <span className="font-semibold text-base text-black ml-2">
                {task.estimateHours ?? '-'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border px-3 py-1 text-[13px] rounded-full border-gray-200 text-gray-700 bg-white font-normal"
              >
                <span
                  className={
                    task.status === 'done'
                      ? 'text-green-600'
                      : task.status === 'blocked'
                        ? 'text-red-600'
                        : task.status === 'in_progress'
                          ? 'text-blue-500'
                          : 'text-gray-400'
                  }
                >
                  ●
                </span>{' '}
                {STATUS_LABEL[task.status]}
              </Badge>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-2">Ngày tạo</span>
              <span className="font-normal text-base text-black ml-2">
                {new Date('2025-10-29T09:30:00Z').toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 mr-2">Cập nhật</span>
              <span className="font-normal text-base text-black ml-2">
                {new Date('2025-10-29T13:15:00Z').toLocaleDateString('vi-VN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>
      <EditTaskModal
        open={editOpen}
        onOpenChange={setEditOpen}
        users={MOCK_USERS}
        task={task}
        onSave={handleSaveTask}
        currentUserId={assigner.id}
      />
    </div>
  )
}
