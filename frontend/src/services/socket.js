import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
    "https://nexora-campus-marketplace.onrender.com",
  {
    transports: ["websocket", "polling"],
    withCredentials: true,
  }
);

export default socket;