export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const ua = request.headers.get('user-agent') || '';

      // 防爬、防扫描、防探针
      const badUA = [
        'curl', 'wget', 'python', 'httpx', 'node', 'axios', 'scrapy',
        'headless', 'puppeteer', 'bot', 'spider', 'scan'
      ];

      if (badUA.some(i => ua.toLowerCase().includes(i))) {
        return new Response('Not Found', { status: 404 });
      }

      // 只允许 TLS 1.2+
      if (!request.cf.tlsVersion || request.cf.tlsVersion < 'TLSv1.2') {
        return new Response('Forbidden', { status: 403 });
      }

      // 伪装成正常网站
      if (request.method === 'GET' && url.pathname === '/') {
        return new Response(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome</title>
</head>
<body>
    <h1>Just a normal site.</h1>
</body>
</html>
        `, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }

      // Reality 流量处理（防墙、防特征、防识别）
      if (url.pathname === '/vless-reality') {
        return handleReality(request);
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      return new Response('Error', { status: 500 });
    }
  }
};

// Reality 核心处理
async function handleReality(request) {
  return new Response(null, {
    status: 200,
    webSocket: true,
  });
}