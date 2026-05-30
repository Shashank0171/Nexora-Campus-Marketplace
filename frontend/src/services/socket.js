import { io } from "socket.io-client";

// Use polling first so the connection works even during Render cold-starts.
// Socket.io will automatically upgrade to WebSocket once the server is fully awake.
const socket = io("https://nexora-fullstack-1.onrender.com", {
  transports: ["polling", "websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,      // wait 2s before first retry
  reconnectionDelayMax: 10000,  // cap at 10s between retries
  timeout: 20000,               // give the server 20s to respond (cold start)
});

socket.on("connect_error", (err) => {
  console.warn("[Socket] Connection error – server may be warming up:", err.message);
});

socket.on("reconnect", (attempt) => {
  console.log(`[Socket] Reconnected on attempt ${attempt}`);
});

export default socket;