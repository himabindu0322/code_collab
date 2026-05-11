require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const executeRoutes = require("./routes/executeRoutes");
const codeRoutes = require("./routes/codeRoutes"); // NEW

const app = express();

const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(express.json());

// ======================
// ROUTES
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/code", executeRoutes);

// SAVE CODE ROUTE
app.use("/api/savecode", codeRoutes);

// ======================
// SOCKET CONNECTION
// ======================

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // ======================
  // JOIN ROOM
  // ======================

  socket.on("join_room", (room) => {
    socket.join(room);

    console.log("User joined room:", room);
  });

  // ======================
  // REAL-TIME CODE SHARE
  // ======================

  socket.on("send_code", (data) => {
    socket.to(data.room).emit("receive_code", data.code);
  });

  // ======================
  // LIVE CHAT
  // ======================

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // ======================
  // VIDEO CALL SOCKET EVENTS
  // ======================

  // USER JOINS VIDEO ROOM
  socket.on("join-video-room", (roomId) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-connected", socket.id);

    console.log("User joined video room:", roomId);
  });

  // SEND OFFER
  socket.on("offer", (data) => {
    socket.to(data.target).emit("offer", {
      offer: data.offer,
      sender: socket.id,
    });
  });

  // SEND ANSWER
  socket.on("answer", (data) => {
    socket.to(data.target).emit("answer", {
      answer: data.answer,
      sender: socket.id,
    });
  });

  // ICE CANDIDATE
  socket.on("ice-candidate", (data) => {
    socket.to(data.target).emit("ice-candidate", {
      candidate: data.candidate,
      sender: socket.id,
    });
  });

  // ======================
  // DISCONNECT
  // ======================

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// ======================
// DATABASE CONNECTION
// ======================

console.log("ENV:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ======================
// PORT
// ======================

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
