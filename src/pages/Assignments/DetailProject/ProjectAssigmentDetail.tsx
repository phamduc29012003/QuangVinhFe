import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import CreateTaskModal, { type CreateTaskFormData } from '@/components/Assignments/CreateTaskModal'
import { useAuthStore } from '@/stores/authStore'
import TaskTable from '@/components/Assignments/ProjectDetailTable/TaskTable'
import TaskList from '@/components/Assignments/ProjectDetailTable/TaskList'
import { useIsMobile } from '@/hooks/use-mobile'

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
}

//

const DUMMY_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn A' },
  { id: 'u2', name: 'Trần Thị B' },
  { id: 'u3', name: 'Lê Văn C' },
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
      tasks: [
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
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0 }}>{project.name}</h2>
          {project.description ? (
            <p style={{ margin: 0, color: '#6b7280' }}>{project.description}</p>
          ) : null}
        </div>
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
    </div>
  )
}

export default ProjectAssignmentDetail
