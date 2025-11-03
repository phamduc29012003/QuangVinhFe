import React, { useEffect, useState } from 'react'

export type InviteMemberModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: { id: string; name: string }[]
  existingMemberIds: string[]
  onSend: (userIds: string[]) => void
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onOpenChange,
  users,
  existingMemberIds,
  onSend,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) setSelectedIds([])
  }, [open])

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleSend() {
    if (selectedIds.length === 0) {
      onOpenChange(false)
      return
    }
    onSend(selectedIds)
    setSelectedIds([])
    onOpenChange(false)
  }

  if (!open) return null

  const candidates = users.filter((u) => !existingMemberIds.includes(u.id))

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div
        onClick={() => onOpenChange(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(560px, 92vw)',
          background: 'white',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: 18 }}>Mời thành viên vào dự án</strong>
            <span style={{ color: '#6b7280' }}>
              Chọn user để mời. Những người đã là thành viên sẽ bị ẩn.
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
          <div
            style={{
              maxHeight: 300,
              overflow: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          >
            {candidates.map((u) => (
              <label
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(u.id)}
                  onChange={() => toggle(u.id)}
                />
                <span>{u.name}</span>
              </label>
            ))}
            {candidates.length === 0 ? (
              <div style={{ padding: 12, color: '#6b7280' }}>Tất cả user đã là thành viên.</div>
            ) : null}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: 'white',
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSend}
              disabled={selectedIds.length === 0}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #111827',
                background: '#111827',
                color: 'white',
                opacity: selectedIds.length === 0 ? 0.6 : 1,
              }}
            >
              Gửi lời mời
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteMemberModal
