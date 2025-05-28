import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/socket";
import authRoutes from "./routes/auth.routes";


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

setupSocket(io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


mongoose
  .connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
