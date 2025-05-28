import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Order from "../models/Order";

// GET /api/vendor/orders
export async function getVendorOrders(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.user.id; // assuming user injected by auth middleware

    const orders = await Order.find({ vendorId }).populate(
      "deliveryPartnerId customerId"
    );

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST /api/vendor/orders/:orderId/assign
export async function assignDeliveryPartner(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.user.id;
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    // Verify order belongs to this vendor
    const order = await Order.findOne({ _id: orderId, vendorId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found or access denied" });
    }

    // Assign delivery partner & update status
    order.deliveryPartnerId = deliveryPartnerId;
    order.status = "assigned";
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
