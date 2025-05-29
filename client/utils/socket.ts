import { io, Socket } from "socket.io-client";

interface LocationUpdate {
  lat: number;
  lng: number;
}

let socketInstance: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  socketInstance = io("http://localhost:5000", {
    auth: { token },  // send JWT token for authentication 
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected with id:", socketInstance?.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export function joinOrderRoom(orderId: string) {
  if (!socketInstance) {
    throw new Error("Socket not connected");
  }
  socketInstance.emit("join-order", orderId);
}

export function listenLocationUpdate(
  callback: (location: LocationUpdate) => void
) {
  if (!socketInstance) {
    throw new Error("Socket not connected");
  }
  socketInstance.on("location-update", callback);
}

export function stopListeningLocationUpdate() {
  if (!socketInstance) return;
  socketInstance.off("location-update");
}
