import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-order", (orderId: string) => {
      socket.join(orderId);
    });

    socket.on("location-update", ({ orderId, lat, lng }) => {
      io.to(orderId).emit("location-update", { lat, lng });
    });
  });
};
