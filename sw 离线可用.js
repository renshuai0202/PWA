const CACHE_NAME = 'pwa';

self.addEventListener('install', event => {
  self.skipWaiting(); // 跳过等待
  // 离线可用，缓存资源
  // 在安装SW时，将相关资源进行缓存
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll([
        'index.html',
        'images/network.png',
        'customer404.html',
        '/'
      ])
    })
  )
});

self.addEventListener('activate', event => {
  clients.claim(); // 立即受控
})

self.addEventListener('fetch', event => {
  // 判断模式：在文档之间导航
  return event.respondWith(
    fetch(event.request)
      .then(res => {
        // 对404页面进行拦截
        if (event.request.mode === 'navigate' && res.status === 404) {
          return fetch('customer404.html');
        }
        // 请求成功，使用请求到的资源
        return res;
      })
      // 离线状态下的处理
      .catch(() => {
        return caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(response => {
            if (response) {
              return response;
            }
            return cache.match('customer404.html');
          })
        })
      })
  )
})