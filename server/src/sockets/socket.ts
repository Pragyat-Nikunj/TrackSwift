import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SUPER_SECRET_JWT_KEY_HERE"; 
const activeSimulations = new Map<string, NodeJS.Timeout>();
const simulatedLocations = new Map<string, { lat: number; lng: number }>();

function simulateMovement(currentLoc: { lat: number; lng: number }): { lat: number; lng: number } {
  const deltaLat = (Math.random() - 0.5) * 0.0005;
  const deltaLng = (Math.random() - 0.5) * 0.0005;
  return {
    lat: currentLoc.lat + deltaLat,
    lng: currentLoc.lng + deltaLng,
  };
}

export function createSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "User:", (socket as any).user?.id);

    socket.on("join-order", (orderId: string) => {
      console.log("--- SERVER RECEIVED JOIN-ORDER EVENT ---", orderId);
      console.log(`Socket ${socket.id} joining order room: ${orderId}`);
      socket.join(orderId);

      // Start simulation if not already active
      if (!activeSimulations.has(orderId)) {
        console.log(`Starting location simulation for order: ${orderId}`);
        const initialLocation = { lat: 23.7950, lng: 86.4340 };
        simulatedLocations.set(orderId, initialLocation);

        const interval = setInterval(() => {
          const currentLoc = simulatedLocations.get(orderId);
          if (currentLoc) {
            const newLoc = simulateMovement(currentLoc);
            simulatedLocations.set(orderId, newLoc);
            io.to(orderId).emit("location-update", newLoc);
          }
        }, 4000);
        activeSimulations.set(orderId, interval);
      }
    });

    socket.on("location-update", ({ orderId, lat, lng }) => {
      io.to(orderId).emit("location-update", { lat, lng }); 
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      activeSimulations.forEach((intervalId, orderId) => {
        const clientsInRoom = io.sockets.adapter.rooms.get(orderId)?.size || 0;
        if (clientsInRoom === 0) {
          clearInterval(intervalId);
          activeSimulations.delete(orderId);
          simulatedLocations.delete(orderId);
          console.log(`Stopped simulation for order: ${orderId} (no clients left)`);
        }
      });
    });
  });

  return io;
}