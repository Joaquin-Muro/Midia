// Mi Día — Service Worker v1
const CACHE_NAME = 'midia-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow('/')
  );
});

// Handle scheduled notifications via postMessage
self.addEventListener('message', e => {
  if(e.data && e.data.type === 'SCHEDULE_NOTIF') {
    const { title, body, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: title,
        requireInteraction: false,
      });
    }, delay || 0);
  }
});

// Background sync - check every minute via periodic sync if supported
self.addEventListener('periodicsync', e => {
  if(e.tag === 'midia-check') {
    e.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  const now    = new Date();
  const hh     = now.getHours();
  const mm     = now.getMinutes();

  if(hh === 6 && mm === 0) {
    await self.registration.showNotification('☀️ Buenos días!', {
      body: 'Empezá. Lo demás viene solo.',
      vibrate: [200, 100, 200],
    });
  }

  if(hh === 23 && mm === 0) {
    await self.registration.showNotification('🌙 Hora de descansar', {
      body: 'Cerrá el día. Mañana seguís.',
      vibrate: [200, 100, 200],
    });
  }
}
