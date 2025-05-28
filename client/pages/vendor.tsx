import { useEffect, useState } from "react";
import axios from "../utils/axios";

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders/my-orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      {orders.map((order: any) => (
        <div key={order._id}>Order: {order._id}</div>
      ))}
    </div>
  );
};

export default VendorDashboard;
