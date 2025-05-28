// models/location.model.ts
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Location", locationSchema);
