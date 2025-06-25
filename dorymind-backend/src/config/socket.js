let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket terhubung:", socket.id);
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io belum diinisialisasi");
  return io;
};

module.exports = { initSocket, getIO };
