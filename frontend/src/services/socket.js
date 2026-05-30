import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL,
  {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
  }
);

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

socket.on("reconnect", (attempt) => {
  console.log(`Socket reconnected after ${attempt} attempts`);
});

export default socket;