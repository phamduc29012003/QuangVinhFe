import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import CreateTaskModal, { type CreateTaskFormData } from '@/components/Assignments/CreateTaskModal'
import { useAuthStore } from '@/stores/authStore'
import TaskTable from '@/components/Assignments/ProjectDetailTable/TaskTable'
import TaskList from '@/components/Assignments/ProjectDetailTable/TaskList'
import { useIsMobile } from '@/hooks/use-mobile'
import InviteMemberModal from '@/components/Assignments/InviteMemberModal'
import { Overview } from '@/components/Assignments/overview'
import { useGetDetailProject } from '@/hooks/assignments/useGetDetailProject'
import { useGetMemberTask, type IMemberTask } from '@/hooks/assignments/useGetMemberTask'
import { useGetAllUser } from '@/hooks/assignments/useGetAllUser'

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

function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

export const ProjectAssignmentDetail: React.FC = () => {
  const { id } = useParams()
  const { projectAssignmentDetail } = useGetDetailProject(Number(id))
  const authUser = useAuthStore((s) => s.user)
  const isMobile = useIsMobile()

  const { memberTask } = useGetMemberTask(Number(id))
  const { allUser } = useGetAllUser()
  console.log('memberTask', allUser)
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

  const [project, setProject] = useState<Project>(initialProject)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  //

  function handleCreateTask(data: CreateTaskFormData) {
    const newTask: Task = {
      id: generateId('t'),
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      assigneeId: data.assigneeId,
      estimateHours: data.estimateHours,
    }
    setProject((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }))
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
        users={DUMMY_USERS}
        onCreate={handleCreateTask}
        currentUserId={authUser?.id as unknown as string | undefined}
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
