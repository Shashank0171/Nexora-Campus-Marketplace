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

// ensure uploads directory exists on production
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const app = express();

// trust reverse proxy (Render) to correctly identify HTTPS req.protocol
app.enable("trust proxy");

// middleware
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// cors configuration allowing dynamic Vercel domains
const allowedOrigins = [
  "https://nexora-fullstack.vercel.app",
  "https://nexora-fullstack-uner.vercel.app",
  "http://localhost:5173"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Normalize trailing slash
    const normalizedOrigin = origin.replace(/\/$/, "");
    
    if (allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    
    return callback(new Error("Blocked by CORS policy: " + origin));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// routes
app.use("/api/auth", authAPI);
app.use("/api/products", productAPI);
app.use("/api/messages", messageAPI);
app.use("/api/wishlist", wishlistAPI);
app.use("/api/admin", adminAPI);
app.use("/api/deals", dealRouter);

// uploads
app.use(
  "/uploads",
  express.static("uploads")
);

// test route
app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "API running",
  });

});

// 404
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found",
  });

});

// 500 error handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// server
const server =
  http.createServer(app);

// socket
const io = new Server(server, {
  cors: corsOptions,
});

io.on(
  "connection",
  (socket) => {

    console.log(
      "User connected:",
      socket.id
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "User disconnected:",
          socket.id
        );

      }
    );

  }
);

// db connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => {

    console.log(
      "MongoDB Connected"
    );

    server.listen(
      process.env.PORT || 8000,
      () => {

        console.log(
          `Server running on ${
            process.env.PORT || 8000
          }`
        );

      }
    );

  })
  .catch((err) => {

    console.log(err);

  });