import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/base/RichTextEditor'

export type CreateTaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

export type CreateTaskFormData = {
  title: string
  description?: string
  estimateHours?: number
  status: CreateTaskStatus
  assigneeId?: string
}

export type CreateTaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: { id: string; name: string }[]
  onCreate: (data: CreateTaskFormData) => void
  currentUserId?: string
}

const STATUS_LABEL: Record<CreateTaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  users,
  onCreate,
  currentUserId,
}) => {
  const [title, setTitle] = useState('')
  const [descriptionHtml, setDescriptionHtml] = useState('')
  const [estimateHours, setEstimateHours] = useState<string>('')
  const [status, setStatus] = useState<CreateTaskStatus>('todo')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  function reset() {
    setTitle('')
    setDescriptionHtml('')
    setEstimateHours('')
    setStatus('todo')
    setAssigneeId('')
  }

  function handleCreate() {
    if (!title.trim()) return
    onCreate({
      title: title.trim(),
      description: descriptionHtml.trim() || undefined,
      estimateHours: estimateHours ? Number(estimateHours) : undefined,
      status,
      assigneeId: assigneeId || undefined,
    })
    reset()
    onOpenChange(false)
  }

  function handleAssigneeChange(value: string) {
    if (value === '__me__') {
      setAssigneeId(currentUserId || '')
      return
    }
    setAssigneeId(value)
  }

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div
        onClick={() => onOpenChange(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(640px, 92vw)',
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: 18 }}>Create Task</strong>
            <span style={{ color: '#6b7280' }}>
              Define task details, estimate time, status and assignee.
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 18,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label>Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label>Description</label>
            <RichTextEditor
              value={descriptionHtml}
              onChange={setDescriptionHtml}
              placeholder="Write a rich description..."
              minHeight={150}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 180 }}
            >
              <label>Estimate (hours)</label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={estimateHours}
                onChange={(e) => setEstimateHours(e.target.value)}
                placeholder="e.g. 4"
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 180 }}
            >
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
              >
                <option value="todo">{STATUS_LABEL['todo']}</option>
                <option value="in_progress">{STATUS_LABEL['in_progress']}</option>
                <option value="done">{STATUS_LABEL['done']}</option>
                <option value="blocked">{STATUS_LABEL['blocked']}</option>
              </select>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 220 }}
            >
              <label>Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
              >
                <option value="">Unassigned</option>
                {currentUserId ? <option value="__me__">Assign to me</option> : null}
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTaskModal
