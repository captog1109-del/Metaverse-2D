const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require('cors');

app.use(cors({
  origin: ['https://hacathon-metaverse.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ server defined BEFORE io
const server = http.createServer(app);

// ✅ io uses server AFTER it's defined
const io = new Server(server, {
  cors: {
    origin: ['https://hacathon-metaverse.vercel.app', 'http://localhost:3000'],
    credentials: true
  }
});


const players = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  players[socket.id] = {
    x: 400,
    y: 400,
    name: "User_" + socket.id.slice(0, 4),
    color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"),
  };

  socket.on("request-players", () => {
    socket.emit("init", players);
  });

  io.emit("players-update", players);

  socket.on("move", ({ x, y, dir }) => {
    if (!players[socket.id]) return;
    players[socket.id].x = x;
    players[socket.id].y = y;
    players[socket.id].dir = dir;
    socket.broadcast.emit("players-update", players);
  });

  socket.on("chat", (message) => {
    const player = players[socket.id];
    if (!player) return;

    io.emit("chat", {
      id: socket.id,
      name: player.name,
      message,
    });
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players-update", players);
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on :${PORT}`));