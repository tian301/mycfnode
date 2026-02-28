export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const upgrade = request.headers.get('Upgrade') || '';

    // 处理 WebSocket 连接（VLESS 流量）
    if (upgrade.toLowerCase() === 'websocket' && url.pathname === '/vless-reality') {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      server.accept();

      // 简单转发 WebSocket 消息
      server.addEventListener('message', (event) => {
        try {
          client.send(event.data);
        } catch (e) {}
      });

      client.addEventListener('message', (event) => {
        try {
          server.send(event.data);
        } catch (e) {}
      });

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // 伪装成正常网站，防止探测
    return new Response(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Just a normal site</title>
</head>
<body>
    <h1>Welcome to my site</h1>
</body>
</html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};
