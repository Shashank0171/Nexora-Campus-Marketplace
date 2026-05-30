import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://nexora-fullstack-1.onrender.com");

export default socket;