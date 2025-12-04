import OneSignal from 'react-onesignal'

export async function initOneSignal() {
  const appId = import.meta.env.VITE_ONE_SIGNAL_APP_ID

  if (!appId) {
    console.warn('dont have appid ')
    return
  }

  await OneSignal.init({
    appId,
    allowLocalhostAsSecureOrigin: true,
    safari_web_id: import.meta.env.VITE_ONE_SIGNAL_SAFARI_WEB_ID,
    serviceWorkerPath: '/OneSignalSDKWorker.js',
  })
}
