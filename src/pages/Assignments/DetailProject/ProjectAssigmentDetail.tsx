import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import CreateTaskModal, { type CreateTaskFormData } from '@/components/Assignments/CreateTaskModal'
import { useAuthStore } from '@/stores/authStore'

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

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
}

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

  const initialProject: Project = useMemo(
    () => ({
      id: id || 'p1',
      name: `Project ${id || 'Demo'}`,
      description: 'This is a demo project detail using local dummy data.',
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

  function updateTask(taskId: string, updater: (t: Task) => Task) {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? updater(t) : t)),
    }))
  }

  function handleChangeStatus(taskId: string, status: TaskStatus) {
    updateTask(taskId, (t) => ({ ...t, status }))
  }

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
          New Task
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {project.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onChangeStatus={handleChangeStatus} />
        ))}
      </div>

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

function TaskCard(props: {
  task: Task
  onChangeStatus: (taskId: string, status: TaskStatus) => void
}) {
  const { task, onChangeStatus } = props

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{task.title}</strong>
          {task.description ? <span style={{ color: '#6b7280' }}>{task.description}</span> : null}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={task.status}
            onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus)}
            style={{ padding: 6, borderRadius: 6, border: '1px solid #d1d5db' }}
          >
            <option value="todo">{STATUS_LABEL['todo']}</option>
            <option value="in_progress">{STATUS_LABEL['in_progress']}</option>
            <option value="done">{STATUS_LABEL['done']}</option>
            <option value="blocked">{STATUS_LABEL['blocked']}</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          color: '#6b7280',
          fontSize: 14,
          flexWrap: 'wrap',
        }}
      >
        <span>Status: {STATUS_LABEL[task.status]}</span>
        <span>Estimate: {task.estimateHours ?? '-'} h</span>
      </div>
    </div>
  )
}

export default ProjectAssignmentDetail
