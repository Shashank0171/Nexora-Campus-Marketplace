import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

// APIs
import authAPI from "./APIs/authAPI.js";
import productAPI from "./APIs/productAPI.js";
import messageAPI from "./APIs/messageAPI.js";
import wishlistAPI from "./APIs/wishlistAPI.js";
import adminAPI from "./APIs/adminAPI.js";
import dealRouter from "./APIs/dealAPI.js";

dotenv.config();

// ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();

// trust proxy (important for Render)
app.enable("trust proxy");

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://nexora-campus-marketplace.vercel.app",
  "https://nexora-campus-marketplace.onrender.com",
  "https://nexora-fullstack-1.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    callback(new Error("Blocked by CORS: " + origin));
  },
  credentials: true,
};

// ================= MIDDLEWARE =================
app.use(cors(corsOptions));          // <-- CORS must come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Explicit preflight handler – ensures CORS headers are present on ALL OPTIONS
// requests, including routes that don't exist (which would otherwise return a
// Render-generated 404 with no CORS headers, confusing the browser).
// Note: Express v5 requires "/{*splat}" instead of bare "*" for catch-all routes.
app.options("/{*splat}", cors(corsOptions));

// ================= ROUTES =================
app.use("/api/auth", authAPI);
app.use("/api/products", productAPI);
app.use("/api/messages", messageAPI);
app.use("/api/wishlist", wishlistAPI);
app.use("/api/admin", adminAPI);
app.use("/api/deals", dealRouter);

// uploads
app.use("/uploads", express.static("uploads"));

// root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

// health-check endpoint – ping this every 14 min with UptimeRobot (free)
// to prevent Render free-tier from sleeping and causing cold-start CORS errors.
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ================= ERROR HANDLING =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      callback(new Error("Blocked by CORS: " + origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room (optional upgrade)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  // send message
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================= DATABASE =================
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 8000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });