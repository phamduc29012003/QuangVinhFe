import { useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'

export default function CustomNotifyButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  const checkSubscription = async () => {
    try {
      const user = await (OneSignal as any).getUser?.()
      setIsSubscribed(!!user?.id)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    checkSubscription()
  }, [])

  const handleSubscribe = async () => {
    try {
      await OneSignal.Slidedown?.promptPush?.()
      checkSubscription()
    } catch (err) {
      console.error(err)
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
