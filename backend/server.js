import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

// Routes
import authAPI from "./APIs/authAPI.js";
import productAPI from "./APIs/productAPI.js";
import messageAPI from "./APIs/messageAPI.js";
import wishlistAPI from "./APIs/wishlistAPI.js";
import adminAPI from "./APIs/adminAPI.js";
import dealRouter from "./APIs/dealAPI.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ======================
// Create uploads folder
// ======================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ======================
// CORS
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://nexora-campus-marketplace.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ======================
// Middlewares
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================
// Static Files
// ======================
app.use("/uploads", express.static("uploads"));

// ======================
// Routes
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running Successfully",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
  });
});

app.use("/api/auth", authAPI);
app.use("/api/products", productAPI);
app.use("/api/messages", messageAPI);
app.use("/api/wishlist", wishlistAPI);
app.use("/api/admin", adminAPI);
app.use("/api/deals", dealRouter);

// ======================
// Socket.IO
// ======================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ======================
// Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ======================
// MongoDB + Server Start
// ======================
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });