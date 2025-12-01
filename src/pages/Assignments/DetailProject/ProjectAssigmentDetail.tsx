import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import CreateTaskModal, { type CreateTaskFormData } from '@/components/Assignments/CreateTaskModal'
import TaskTable from '@/components/Assignments/ProjectDetailTable/TaskTable'
import TaskList from '@/components/Assignments/ProjectDetailTable/TaskList'
import { useIsMobile } from '@/hooks/use-mobile'
import InviteMemberModal from '@/components/Assignments/InviteMemberModal'
import { Overview } from '@/components/Assignments/overview'
import { useGetDetailProject } from '@/hooks/assignments/useGetDetailProject'
import { useGetMemberTask, type IMemberTask } from '@/hooks/assignments/useGetMemberTask'
import { useCreateTask } from '@/hooks/assignments/task/useCreateTask'

export type User = {
  id: string
  name: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'pending' | 'cancel'

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  assigneeId?: string
  estimateHours?: number
}

export type Project = {
  id: string
  name: string
  description?: string
  tasks: Task[]
  members: string[] // user ids
}

//

const DUMMY_USERS: User[] = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'u3', name: 'Charlie' },
]

export const ProjectAssignmentDetail: React.FC = () => {
  const { id } = useParams()
  const { projectAssignmentDetail, isFetching } = useGetDetailProject(Number(id))
  console.log('projectAssignmentDetail', projectAssignmentDetail)
  const isMobile = useIsMobile()

  const { memberTask } = useGetMemberTask(Number(id))
  const createTaskMutation = useCreateTask()

  const initialProject: Project = useMemo(
    () => ({
      id: id || 'p1',
      name: `Hệ thống quản lý kho mobile`,
      description: 'Dự án phát triển ứng dụng quản lý kho hàng trên nền tảng di động.',
      members: ['u1', 'u2'],
      tasks: [
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
          status: 'cancel',
          assigneeId: undefined,
          estimateHours: 5,
        },
        {
          id: 't4',
          title: 'Implement auth flow',
          description: 'Login, register and protected routes',
          status: 'done',
          assigneeId: undefined,
          estimateHours: 5,
        },
        {
          id: 't5',
          title: 'Implement auth flow',
          description: 'Login, register and protected routes',
          status: 'done',
          assigneeId: undefined,
          estimateHours: 5,
        },
        {
          id: 't6',
          title: 'Implement auth flow',
          description: 'Login, register and protected routes',
          status: 'pending',
          assigneeId: undefined,
          estimateHours: 5,
        },
      ],
    }),
    [id]
  )

  const [project] = useState<Project>(initialProject)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  //

  function handleCreateTask(data: CreateTaskFormData) {
    createTaskMutation.mutate({
      task: {
        description: data.description,
        priority: data.priority,
        taskType: data.taskType,
        groupId: Number(id),
        estimateTime: data.estimateTime,
        imageUrls: data.imageUrls,
        checkList: data.checkList,
        assignee: data.assignee,
        status: data.status,
        startTime: data.startTime,
      },
    })
  }

  // Loading fallback
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Đang tải chi tiết dự án...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="m-0">{projectAssignmentDetail?.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Thành viên:</span>
            <div className="flex gap-1.5 flex-wrap">
              {memberTask && memberTask.length > 0 ? (
                memberTask.map((member: IMemberTask) => (
                  <span
                    key={member.id}
                    className="text-xs px-2 py-0.5 border border-gray-200 rounded-full bg-gray-50"
                  >
                    {member.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Chưa có thành viên</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-slate-900"
          >
            Mời thành viên
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-slate-900 text-white"
          >
            Tạo công việc mới
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <Overview tasks={project.tasks} />

      {isMobile ? (
        <TaskList tasks={project.tasks} assignees={DUMMY_USERS} />
      ) : (
        <TaskTable tasks={project.tasks} assignees={DUMMY_USERS} />
      )}

      <CreateTaskModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        memberTask={memberTask || []}
        onCreate={handleCreateTask}
        groupId={Number(id)}
      />

      <InviteMemberModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        taskGroupId={Number(id)}
        existingMemberIds={memberTask?.map((m: IMemberTask) => String(m.id)) || []}
      />
    </div>
  )
}

export default ProjectAssignmentDetail
