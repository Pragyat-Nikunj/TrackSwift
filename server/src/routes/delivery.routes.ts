import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getAssignedOrders, updateOrderStatus } from "../controllers/delivery.controller";

const router = express.Router();

router.get("/orders", authMiddleware(["delivery"]), getAssignedOrders);
router.patch("/orders/:id/status", authMiddleware(["delivery"]), updateOrderStatus);

export default router;
