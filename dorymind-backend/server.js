const http = require('http');
const app = require('./app');
const { initSocket } = require('./src/config/socket');

const server = http.createServer(app);

initSocket(server);

server.listen(5000, '0.0.0.0', () => {
  console.log("🚀 Server berjalan di PORT: 5000");
});
