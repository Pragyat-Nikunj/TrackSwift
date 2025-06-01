import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  placeOrder,
  getOrderDetails,
  trackOrder,
  getAllCustomerOrders,
} from "../controllers/customer.controller";

const router = express.Router();
router.get("/orders", authMiddleware(["customer"]), getAllCustomerOrders);
router.post("/orders", authMiddleware(["customer"]), placeOrder);
router.get("/orders/:id", authMiddleware(["customer"]), getOrderDetails);
router.get("/orders/:id/track", authMiddleware(["customer"]), trackOrder);

export default router;
