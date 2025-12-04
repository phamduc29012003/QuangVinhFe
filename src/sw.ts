/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

// Lắng nghe sự kiện push từ server
self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  const data = event.data.json
    ? event.data.json()
    : { title: 'Notification', body: event.data.text() }

  const title = data.title || 'Thông báo mới'
  const options: NotificationOptions = {
    body: data.body || '',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/icon-192x192.png',
    data: data.data || {},
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Click vào notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus()
          if ('navigate' in client) {
            ;(client as WindowClient).navigate(url)
          }
          return
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})
