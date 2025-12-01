import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { AvatarEditor } from '@/components/Profile'
import { InlineField } from '@/components/Profile'
import { InfoGrid } from '@/components/Profile'
import { GET, PUT } from '@/core/api'
import SonnerToaster from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/authStore'

export const Profile = () => {
  const { id } = useParams()
  const { user, logout } = useAuthStore()
  console.log('user', user)

  const navigate = useNavigate()
  const isOwnProfile = useMemo(() => !id || id === user?.id, [id, user?.id])
  const currentUserId = useMemo(() => (isOwnProfile ? user?.id : id), [isOwnProfile, id, user?.id])
  const [displayName, setDisplayName] = useState<string>(user?.name ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // extra fields
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [position, setPosition] = useState<string>('')

  // inline field state handled inside components now

  // Dummy data fallback
  const getMockProfile = () => ({
    name: 'Nguyễn Văn A',
    avatar: '',
    email: 'example@gmail.com',
    phone: '0909 123 456',
    position: 'Nhân viên',
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // Prefill for own profile from store
    if (isOwnProfile && user) {
      setDisplayName(user.name ?? '')
      setAvatarUrl(user.avatar)
      setEmail(user.email ?? '')
      setPhone(user.phone ?? '')
      setPosition(user.roles?.[0] ?? (user as any)?.position ?? '')
      return
    }
    // Own profile but no user info available -> dummy
    if (isOwnProfile && !user) {
      const mock = getMockProfile()
      setDisplayName(mock.name)
      setAvatarUrl(mock.avatar)
      setEmail(mock.email)
      setPhone(mock.phone)
      setPosition(mock.position)
    }
  }, [isOwnProfile, user])

  useEffect(() => {
    // Fetch other user's profile when viewing by id
    const fetchOther = async () => {
      if (isOwnProfile || !id) return
      try {
        setIsLoading(true)
        const res = await GET(`/api/users/${id}`)
        const other = res?.data ?? res
        setDisplayName(other?.name ?? '')
        setAvatarUrl(other?.avatar)
        setEmail(other?.email ?? '')
        setPhone(other?.phone ?? '')
        setPosition(other?.roles?.[0] ?? other?.position ?? '')
      } catch {
        // Use dummy data when cannot fetch other user's profile
        const mock = getMockProfile()
        setDisplayName(mock.name)
        setAvatarUrl(mock.avatar)
        setEmail(mock.email)
        setPhone(mock.phone)
        setPosition(mock.position)
        SonnerToaster({ type: 'error', message: 'Không tải được hồ sơ, dùng dữ liệu mẫu' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchOther()
  }, [isOwnProfile, id])

  const handlePickAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const preview = URL.createObjectURL(file)
    setAvatarUrl(preview)
  }

  const handleUpdateAvatar = async () => {
    if (!currentUserId || !avatarFile) return
    try {
      setIsSaving(true)
      const form = new FormData()
      form.append('avatar', avatarFile)
      await PUT(`/api/users/${currentUserId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      SonnerToaster({ type: 'success', message: 'Đã cập nhật ảnh đại diện' })
    } catch {
      SonnerToaster({ type: 'error', message: 'Cập nhật ảnh thất bại' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    navigate('/login')
    logout()
  }
  // kept avatar update via dedicated change; other fields update inline by field

  const handleUpdateSingleField = async (field: 'name' | 'email' | 'phone' | 'position') => {
    if (!currentUserId) return
    try {
      setIsSaving(true)
      const form = new FormData()
      if (field === 'name') form.append('name', displayName)
      if (field === 'email') form.append('email', email)
      if (field === 'phone') form.append('phone', phone)
      if (field === 'position') form.append('position', position)

      await PUT(`/api/users/${currentUserId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      SonnerToaster({ type: 'success', message: 'Đã cập nhật' })
    } catch {
      SonnerToaster({ type: 'error', message: 'Cập nhật thất bại' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Cover area like Facebook */}
      <div className="h-44 w-full rounded-b-md bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900" />

      {/* Profile header */}
      <div className="mx-auto -mt-12 flex w-full max-w-3xl flex-col items-center px-4">
        <AvatarEditor
          isOwnProfile={!!isOwnProfile}
          avatarUrl={avatarUrl}
          isSaving={isSaving}
          hasNewFile={!!avatarFile}
          onPick={handlePickAvatar}
          onUpdate={handleUpdateAvatar}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <div className="mt-4 flex w-full flex-col items-center gap-3">
          <div className="relative w-full max-w-md">
            <InlineField
              value={displayName}
              placeholder="Tên hiển thị"
              disabled={!isOwnProfile || isLoading}
              saving={isSaving}
              onChange={setDisplayName}
              onUpdate={() => handleUpdateSingleField('name')}
            />
          </div>

          {/* Extra fields */}
          <InfoGrid
            isOwnProfile={!!isOwnProfile}
            isLoading={isLoading}
            isSaving={isSaving}
            email={email}
            phone={phone}
            position={position}
            onChangeEmail={setEmail}
            onChangePhone={setPhone}
            onChangePosition={setPosition}
            onUpdateField={(field) => handleUpdateSingleField(field)}
          />

          {isOwnProfile ? (
            <div className="mt-2 flex items-center gap-3">
              <Button variant="destructive" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          ) : null}
        </div>

        {/* Optional sections similar to FB: intro and tabs placeholder */}
        <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-md border p-4">
            <div className="font-semibold">Giới thiệu</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Cập nhật thông tin cá nhân của bạn để mọi người biết bạn hơn.
            </div>
          </div>
          <div className="md:col-span-2 rounded-md border p-4">
            <div className="font-semibold">Bài viết</div>
            <div className="mt-2 text-sm text-muted-foreground">Đang cập nhật...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
