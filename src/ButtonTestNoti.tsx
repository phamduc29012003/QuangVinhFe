import { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

export default function CustomNotifyButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Kiểm tra trạng thái subscribe khi load
  useEffect(() => {
    ;(async () => {
      try {
        const subscriptionId = await (OneSignal as any)?.User?.PushSubscription?.getId?.()
        setIsSubscribed(Boolean(subscriptionId))
      } catch (err) {
        console.error('Check subscription error', err)
      }
    })()
  }, [])

  const handleSubscribe = async () => {
    try {
      // Gợi ý: dùng API permission chính thức thay vì Slidedown (tùy version SDK bạn dùng)
      await (OneSignal as any)?.Notifications?.requestPermission?.()

      const subscriptionId = await (OneSignal as any)?.User?.PushSubscription?.getId?.()
      setIsSubscribed(Boolean(subscriptionId))
    } catch (err) {
      console.error('Subscribe error', err)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isSubscribed}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '12px 24px',
        borderRadius: '12px',
        backgroundColor: isSubscribed ? '#4caf50' : '#2196f3',
        color: '#fff',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        zIndex: 9999,
      }}
    >
      {isSubscribed ? 'Bạn đã bật thông báo' : 'Bật thông báo'}
    </button>
  )
}
