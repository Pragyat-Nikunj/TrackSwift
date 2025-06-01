import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Order from "../models/Order";
import Location from "../models/Location";
export async function placeOrder(req: AuthRequest, res: Response) {
  try {

    const customerId = req.user.id;
    const { vendorId } = req.body;

    const newOrder = await Order.create({
      customerId,
      vendorId,
      status: "pending",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getOrderDetails(req: AuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    const customerId = req.user.id;

    const order = await Order.findOne({ _id: orderId, customerId })
      .populate("vendorId", "name")
      .populate("deliveryPartnerId", "name");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
}

export async function trackOrder(req: AuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    const customerId = req.user.id;

    const order = await Order.findOne({ _id: orderId, customerId });

    if (!order || !order.deliveryPartnerId) {
      return res
        .status(404)
        .json({ success: false, message: "No delivery partner assigned" });
    }

    const latestLocation = await Location.findOne({ orderId }).sort({
      timestamp: -1,
    });

    if (!latestLocation) {
      return res
        .status(404)
        .json({ success: false, message: "No location available yet" });
    }

    res.json({ success: true, location: latestLocation });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to track order" });
  }
}

export async function getAllCustomerOrders(req: AuthRequest, res: Response) {
  try {
    const customerId = req.user.id;

    const orders = await Order.find({ customerId })
      .populate("vendorId", "name") 
      .populate("deliveryPartnerId", "name"); 

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch customer orders" });
  }
}
