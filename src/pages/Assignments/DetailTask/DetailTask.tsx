import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { TaskRow } from '@/components/Assignments/ProjectDetailTable/columns'
import { Pencil, Check, X, MessageCircle } from 'lucide-react'
import { useGetDetailTask } from '@/hooks/assignments/useGetDetailTask'
import { CommentTask } from '@/components/Task/CommentTask'
import { SidebarTask } from '@/components/Task/SidebarTask'
import CreateTaskModal from '@/components/Assignments/CreateTaskModal'
import { BottomSheetTask } from '@/components/Task/BottomSheet'
import { EditorJSComponent } from '@/components/Editor'
import type { OutputData } from '@editorjs/editorjs'
import { convertEditorJSToHTML, convertHTMLToEditorJS } from '@/utils/editorjs'
import { MobileBar } from '@/components/Task/MolbieBar'
import { useGetMemberTask } from '@/hooks/assignments/useGetMemberTask'
import { DetailSection } from '@/components/Task/DetailSection'
import { useUpdateTask } from '@/hooks/assignments/task/useUpdateTask'
import { useUpdateDescription } from '@/hooks/assignments/task/useUpdateDescription'

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
    estimateTime: 8,
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
    estimateTime: 3,
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
    estimateTime: 2,
  },
]

export const DetailTask = () => {
  const { id } = useParams()
  const { projectAssignmentDetail } = useGetDetailTask(Number(id))
  console.log(projectAssignmentDetail)
  const updateTaskMutation = useUpdateTask()
  const { memberTask } = useGetMemberTask(projectAssignmentDetail?.groupId || 0)
  const [editOpen, setEditOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [task, setTask] = useState(MOCK_TASKS.find((t) => t.id === id) || MOCK_TASKS[0])
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState<OutputData>(() =>
    convertHTMLToEditorJS(projectAssignmentDetail?.checkList || '')
  )
  const updateDescriptionMutation = useUpdateDescription()

  // Sync editedDescription when projectAssignmentDetail changes
  useEffect(() => {
    if (projectAssignmentDetail?.checkList) {
      const converted = convertHTMLToEditorJS(projectAssignmentDetail.checkList)
      console.log('Initial data from API:', projectAssignmentDetail.checkList)
      console.log('Converted to EditorJS:', converted)
      setEditedDescription(converted)
    }
  }, [projectAssignmentDetail?.checkList])

  const assignee = useMemo(() => MOCK_USERS.find((u) => u.id === task?.assigneeId), [task])
  const assigner = MOCK_USERS[2]

  const handleSaveDescription = () => {
    console.log('editedDescription state:', editedDescription)
    const descriptionHTML = convertEditorJSToHTML(editedDescription)
    console.log('Converted HTML:', descriptionHTML)
    updateDescriptionMutation.mutate({ taskId: Number(id), checklist: descriptionHTML })
    setIsEditingDescription(false)
  }

  const handleCancelEdit = () => {
    setEditedDescription(convertHTMLToEditorJS(projectAssignmentDetail?.checkList || ''))
    setIsEditingDescription(false)
  }

  const handleStartEdit = () => {
    setEditedDescription(convertHTMLToEditorJS(projectAssignmentDetail?.checkList || ''))
    setIsEditingDescription(true)
  }

  if (!projectAssignmentDetail)
    return <div className="text-center pt-20 text-2xl text-gray-400">Task not found.</div>

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MobileBar assignee={assignee} setInfoOpen={setInfoOpen} />

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 flex-1">
                    {projectAssignmentDetail.description}
                  </h1>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                    className="text-gray-700 hover:bg-gray-100 bg-gray-200"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-100 bg-gray-200"
                    onClick={() => {
                      const commentSection = document.querySelector('.comments-section')
                      commentSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Add comment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-100 bg-gray-200"
                  >
                    Assign
                  </Button>

                  <Select
                    value={String(projectAssignmentDetail?.status || 1)}
                    onValueChange={(value: string) => {
                      // Update task status
                      console.log('Update status to:', value)
                    }}
                  >
                    <SelectTrigger className="w-[120px] bg-green-600 text-white border-green-600 hover:bg-green-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">To Do</SelectItem>
                      <SelectItem value="2">In Progress</SelectItem>
                      <SelectItem value="3">Done</SelectItem>
                      <SelectItem value="4">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Details Section */}
                <DetailSection projectAssignmentDetail={projectAssignmentDetail} />

                <div className="relative group">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Mô tả</h3>
                  </div>

                  {isEditingDescription ? (
                    <div className="space-y-3">
                      <div className="border rounded-md p-4">
                        <EditorJSComponent
                          data={editedDescription}
                          onChange={setEditedDescription}
                          placeholder="Nhập mô tả công việc..."
                        />
                      </div>
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
                      {projectAssignmentDetail?.checkList ? (
                        <EditorJSComponent
                          data={convertHTMLToEditorJS(projectAssignmentDetail.checkList)}
                          readOnly={true}
                          placeholder=""
                        />
                      ) : (
                        <span className="italic text-gray-400">Chưa có mô tả - Click để thêm</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments Card */}
            <div className="comments-section">
              <CommentTask member={memberTask || []} taskId={id ? Number(id) : 0} />
            </div>
          </div>

          {/* Sidebar */}
          <SidebarTask projectAssignmentDetail={projectAssignmentDetail} />
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
        memberTask={memberTask}
        onCreate={(data) => {
          setEditOpen(false)
          updateTaskMutation.mutate({
            taskId: Number(id),
            groupId: projectAssignmentDetail?.groupId || 0,
            description: data.description,
            priority: data.priority,
            taskType: data.taskType,
            estimateTime: data.estimateTime,
            status: data.status,
            assigneeId: data.assigneeId,
            startTime: data.startTime,
          })
        }}
        mode="edit"
        initialData={{
          description: projectAssignmentDetail.description, // Mapping title to description as per CreateTaskModal structure
          priority: projectAssignmentDetail.priority, // Default or map from task if available
          taskType: projectAssignmentDetail.taskType, // Default or map from task if available
          estimateTime: projectAssignmentDetail.estimateTime, // Reverse calc or mock
          status: projectAssignmentDetail.status, // Map status string to number
          assigneeId: projectAssignmentDetail.assigneeId,
          startTime: projectAssignmentDetail.startTime, // Mock
        }}
        groupId={projectAssignmentDetail?.groupId || 0}
      />
    </div>
  )
}
