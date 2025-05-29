import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createSocketServer } from "./sockets/socket";
import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import customerRoutes from "./routes/customer.routes";
import deliveryRoutes from "./routes/delivery.routes";
import { log } from "console";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = createSocketServer(server); 

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/delivery", deliveryRoutes);

mongoose
  .connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error(err));
