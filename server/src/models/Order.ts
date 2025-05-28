import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  vendorId: Types.ObjectId;
  customerId: Types.ObjectId;
  deliveryPartnerId?: Types.ObjectId | null; 
  status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
//storing last known location
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deliveryPartnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
