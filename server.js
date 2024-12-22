
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let currentTime = 0;
let timerInterval;

function startCountdown() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      io.emit('timer_update', currentTime);
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current timer state to newly connected client
  socket.emit('timer_update', currentTime);

  socket.on('start_timer', (time) => {
    currentTime = time;
    io.emit('timer_update', currentTime);
    startCountdown();
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});