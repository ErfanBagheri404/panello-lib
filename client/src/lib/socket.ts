// src/lib/socket.ts
import { io } from "socket.io-client";

const socket = io(`/api`, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
