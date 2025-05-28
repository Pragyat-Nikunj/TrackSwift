import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getVendorOrders,
  assignDeliveryPartner,
} from "../controllers/vendor.controller";

const router = express.Router();

router.get("/orders", authMiddleware(["vendor"]), getVendorOrders);
router.post("/orders/:orderId/assign", authMiddleware(["vendor"]), assignDeliveryPartner);

export default router;
