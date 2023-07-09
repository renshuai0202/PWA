// install事件，是发送给SW的第一个事件，为离线作准备
// install事件处理完成，SW视为已安装
self.addEventListener('install', event => {
  self.skipWaiting(); // 跳过等待
});

// 存在一种情况，打开的页面正在运行旧版本SW，下载的SW是新版本。
// 处理办法1：关闭旧版本SW控制的页面，安全停用旧版本SW，新版本SW将收到activate事件（激活事件）
// 处理办法2: 新版本SW在install事件调用skipWaiting函数，则用户无需关闭网页，重新打开网页，新版本SW便能够立即控制页面。（不是真正控制页面）在active事件，调用claim，可以真正地让新版本SW立即控制页面。
// active事件作用：清除旧版SW资源
self.addEventListener('activate', event => {
  clients.claim(); // 立即受控
})

// 拦截图片
// 第一步：修改SW
// 第二步：刷新页面，注册新SW，注册完成后，请求已获取图片资源，仍显示就图
// 第三步: 重新请求图片，然后拦截
self.addEventListener('fetch', event => {
  console.log('fetch', event.request.url);
  if (/network\.png$/.test(event.request.url)) {
    return event.respondWith(fetch('images/pwa.png'));
  }
})

// 对404页面进行拦截
self.addEventListener('fetch', event => {
  // 判断模式：在文档之间导航
  if (event.request.mode === 'navigate') {
    console.log('true');
    return event.respondWith(
      fetch(event.request).then(res => {
        console.log(res.status);
        if (res.status === 404) {
          return fetch('customer404.html');
        } else {
          return res;
        }

      })
    )
  }
})