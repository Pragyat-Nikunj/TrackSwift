import { Request, Response } from "express";
import Order from "../models/Order";
import { AuthRequest } from "../middleware/auth";

export const getAssignedOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ deliveryPartnerId: req.user.id });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryPartnerId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this order" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
};
