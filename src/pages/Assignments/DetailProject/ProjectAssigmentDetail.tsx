import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import CreateTaskModal, { type CreateTaskFormData } from '@/components/Assignments/CreateTaskModal'
import { useAuthStore } from '@/stores/authStore'
import TaskTable from '@/components/Assignments/ProjectDetailTable/TaskTable'
import TaskList from '@/components/Assignments/ProjectDetailTable/TaskList'
import { useIsMobile } from '@/hooks/use-mobile'
import InviteMemberModal from '@/components/Assignments/InviteMemberModal'

export type User = {
  id: string
  name: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

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
  const authUser = useAuthStore((s) => s.user)
  const isMobile = useIsMobile()

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
          status: 'blocked',
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

  function handleInviteMembers(userIds: string[]) {
    if (!userIds.length) {
      setIsInviteOpen(false)
      return
    }
    setProject((prev) => ({
      ...prev,
      members: Array.from(new Set([...prev.members, ...userIds])),
    }))
    setIsInviteOpen(false)
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0 }}>{project.name}</h2>
          {project.description ? (
            <p style={{ margin: 0, color: '#6b7280' }}>{project.description}</p>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>Thành viên:</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {project.members.map((mid) => {
                const u = DUMMY_USERS.find((x) => x.id === mid)
                return (
                  <span
                    key={mid}
                    style={{
                      fontSize: 12,
                      padding: '2px 8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: 999,
                      background: '#f9fafb',
                    }}
                  >
                    {u?.name || mid}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setIsInviteOpen(true)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: 'white',
              color: '#111827',
            }}
          >
            Mời thành viên
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#111827',
              color: 'white',
            }}
          >
            Tạo công việc mới
          </button>
        </div>
      </div>

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
        users={DUMMY_USERS}
        existingMemberIds={project.members}
        onSend={handleInviteMembers}
      />
    </div>
  )
}

export default ProjectAssignmentDetail
