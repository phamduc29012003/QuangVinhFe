import InlineField from './InlineField'

interface InfoGridProps {
  isOwnProfile: boolean
  isLoading?: boolean
  isSaving?: boolean
  address: string
  phone: string
  education: string
  position: string
  onChangeAddress: (v: string) => void
  onChangePhone: (v: string) => void
  onChangeEducation: (v: string) => void
  onChangePosition: (v: string) => void
  onUpdateField: (field: 'address' | 'phone' | 'education' | 'position') => void
}

export const InfoGrid = ({
  isOwnProfile,
  isLoading,
  isSaving,
  address,
  phone,
  education,
  position,
  onChangeAddress,
  onChangePhone,
  onChangeEducation,
  onChangePosition,
  onUpdateField,
}: InfoGridProps) => {
  const disabled = !isOwnProfile || !!isLoading
  return (
    <div className="mt-2 grid w-full max-w-3xl grid-cols-1 gap-3 md:grid-cols-2">
      <InlineField
        value={address}
        placeholder="Địa chỉ"
        disabled={disabled}
        saving={isSaving}
        onChange={onChangeAddress}
        onUpdate={() => onUpdateField('address')}
      />
      <InlineField
        value={phone}
        placeholder="Số điện thoại"
        disabled={disabled}
        saving={isSaving}
        onChange={onChangePhone}
        onUpdate={() => onUpdateField('phone')}
      />
      <InlineField
        value={education}
        placeholder="Học vấn"
        disabled={disabled}
        saving={isSaving}
        onChange={onChangeEducation}
        onUpdate={() => onUpdateField('education')}
      />
      <InlineField
        value={position}
        placeholder="Chức vụ"
        disabled={disabled}
        saving={isSaving}
        onChange={onChangePosition}
        onUpdate={() => onUpdateField('position')}
      />
    </div>
  )
}

export default InfoGrid
