import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import EditTaskModal from '@/components/Assignments/EditTaskModal'
import { STATUS_LABEL } from '@/components/Assignments/ProjectDetailTable/columns'
import type { TaskRow } from '@/components/Assignments/ProjectDetailTable/columns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { BottomSheet } from '@/components/ui/bottom-sheet'
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
const MOCK_COMMENTS = [
  {
    id: 'c1',
    userId: 'u3',
    userName: 'Charlie',
    avatar: '/photo_2025-09-26_12-28-52 (2).jpg',
    content: 'Chỗ ước lượng t có thể làm nhanh hơn.',
    date: '2025-10-29T11:23:00Z',
  },
  {
    id: 'c2',
    userId: 'u1',
    userName: 'Alice',
    avatar: '/photo_2025-09-26_12-28-52 (3).jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T12:20:00Z',
  },
  {
    id: 'c3',
    userId: 'u2',
    userName: 'Bob',
    avatar: 'photo_2025-09-26_12-28-52.jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T13:20:00Z',
  },
  {
    id: 'c4',
    userId: 'u3',
    userName: 'Charlie',
    avatar: '/photo_2025-09-26_12-28-53.jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T14:20:00Z',
  },
  {
    id: 'c5',
    userId: 'u1',
    userName: 'Alice',
    avatar: '/photo_2025-09-26_12-28-54.jpg',
    content: 'OK để t lên CI trước.',
    date: '2025-10-29T15:20:00Z',
  },
]

export const DetailTask = () => {
  const { id } = useParams()
  const [comments, setComments] = useState(MOCK_COMMENTS)
  const [commentInput, setCommentInput] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [task, setTask] = useState(MOCK_TASKS.find((t) => t.id === id) || MOCK_TASKS[0])
  const assignee = useMemo(() => MOCK_USERS.find((u) => u.id === task?.assigneeId), [task])
  const assigner = MOCK_USERS[2]
  const navigate = useNavigate()
  function handleNavigate(userId: string) {
    navigate(`/profile/${userId}`)
  }
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
        userId: '123',
        userName: 'John Doe',
        avatar: '/photo_2025-09-26_12-28-52 (2).jpg',
        content: commentInput.trim(),
        date: new Date().toISOString(),
      },
      ...comments,
    ])
    setCommentInput('')
  }
  if (!task) return <div className="text-center pt-20 text-2xl text-gray-400">Task not found.</div>
  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-16 p-4 md:p-7 bg-white min-h-screen">
      {/* Main content left */}
      <div className="flex-1 max-w-2xl w-full order-2 xl:order-1">
        {/* Header Bar & Title */}
        <div className="flex items-center gap-2 mb-3 md:mb-4 group">
          <Button variant="ghost" size="icon" className="rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Button>
          <span className="text-[11px] md:text-xs text-gray-400">Project / Task</span>
        </div>
        {/* Mobile compact info bar */}
        <div className="xl:hidden mb-3">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={
                  task.status === 'done'
                    ? 'text-green-600'
                    : task.status === 'cancel'
                      ? 'text-red-600'
                      : task.status === 'in_progress'
                        ? 'text-blue-500'
                        : 'text-gray-400'
                }
              >
                ●
              </span>
              <span className="text-sm font-medium text-gray-800 truncate max-w-[40vw]">
                {assignee?.name || 'Chưa gán'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-0.5 text-[12px]">
                {STATUS_LABEL[task.status]}
              </Badge>
              <Button size="sm" className="h-8 px-3" onClick={() => setInfoOpen(true)}>
                Chi tiết
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-2">
          <h1 className="font-bold text-2xl md:text-3xl text-black leading-tight flex items-center">
            {task.title}
          </h1>
          <Badge
            variant="outline"
            className="border px-2.5 md:px-3 py-0.5 md:py-1 text-[12px] md:text-[13px] rounded-full border-gray-200 text-gray-700 gap-1 bg-white font-normal"
          >
            <span
              className={
                task.status === 'done'
                  ? 'text-green-600'
                  : task.status === 'cancel'
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
        <div className="bg-neutral-50 rounded-lg px-4 md:px-6 py-4 md:py-5 mb-6 md:mb-8 min-h-[25vh] border border-gray-100 text-[14px] md:text-[15px] text-gray-800 prose max-w-none overflow-y-auto">
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
          <h4 className="font-semibold text-base md:text-lg text-gray-700">Bình luận</h4>
        </div>
        <div className="flex flex-col gap-2 max-h-[20vh] overflow-y-auto pr-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <Avatar
                onClick={() => handleNavigate('123')}
                className="size-8 text-xs cursor-pointer"
              >
                <AvatarImage src={c.avatar} alt={c.userName} />
                <AvatarFallback>{c.userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    onClick={() => handleNavigate('123')}
                    className="font-semibold text-gray-800 text-sm cursor-pointer hover:text-blue-500"
                  >
                    {c.userName}
                  </span>
                  <span className="text-gray-400 text-[11px] md:text-xs">
                    {new Date(c.date).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="text-[14px] md:text-[15px] text-gray-700">{c.content}</div>
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
            className="rounded-lg border-gray-200 bg-white text-[14px] md:text-base focus:ring-1 focus:ring-gray-200 resize-none min-h-10"
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
      <aside className="w-full hidden xl:block max-w-full xl:max-w-xs xl:sticky xl:top-16 flex-shrink-0 order-1 xl:order-2 mb-4 xl:mb-0">
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-none px-4 md:px-6 py-3 md:py-4 ">
          <CardTitle className="text-gray-400 text-sm md:text-base font-semibold mb-2 md:mb-3 tracking-wide">
            Thông tin
          </CardTitle>
          <CardContent className="flex flex-col gap-2.5 md:gap-3 px-0">
            <div className="flex items-center gap-3">
              <UserPlus2 className="w-4 h-4 text-gray-400" />
              <span className="text-[11px] md:text-xs text-gray-500 mr-2">Người được giao</span>
              <span className="font-semibold text-sm md:text-base text-black ml-2">
                {assignee?.name || <span className="text-gray-300">Chưa gán</span>}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <UserCircle2 className="w-4 h-4 text-gray-400" />
              <span className="text-[11px] md:text-xs text-gray-500 mr-2">Người giao</span>
              <span className="font-semibold text-sm md:text-base text-black ml-2">
                {assigner?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock4 className="w-4 h-4 text-gray-400" />
              <span className="text-[11px] md:text-xs text-gray-500 mr-2">Ước lượng</span>
              <span className="font-semibold text-sm md:text-base text-black ml-2">
                {task.estimateHours ?? '-'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border px-2.5 md:px-3 py-0.5 md:py-1 text-[12px] md:text-[13px] rounded-full border-gray-200 text-gray-700 bg-white font-normal"
              >
                <span
                  className={
                    task.status === 'done'
                      ? 'text-green-600'
                      : task.status === 'cancel'
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
              <span className="text-[11px] md:text-xs text-gray-500 mr-2">Ngày tạo</span>
              <span className="font-normal text-sm md:text-base text-black ml-2">
                {new Date('2025-10-29T09:30:00Z').toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-[11px] md:text-xs text-gray-500 mr-2">Cập nhật</span>
              <span className="font-normal text-sm md:text-base text-black ml-2">
                {new Date('2025-10-29T13:15:00Z').toLocaleDateString('vi-VN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Mobile detail sheet */}
      <BottomSheet
        open={infoOpen}
        onOpenChange={setInfoOpen}
        title="Thông tin công việc"
        padded={false}
        contentClassName="rounded-t-2xl p-0"
      >
        <div className="p-4 flex flex-col gap-3">
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
            <Badge variant="outline" className="px-3 py-1 text-[13px]">
              <span
                className={
                  task.status === 'done'
                    ? 'text-green-600'
                    : task.status === 'cancel'
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
          <Separator className="my-1" />
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 mr-2">Ngày tạo</span>
            <span className="text-base text-black ml-2">
              {new Date('2025-10-29T09:30:00Z').toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 mr-2">Cập nhật</span>
            <span className="text-base text-black ml-2">
              {new Date('2025-10-29T13:15:00Z').toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </BottomSheet>
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
