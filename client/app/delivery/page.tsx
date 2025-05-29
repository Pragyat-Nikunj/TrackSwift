"use client";
import React, { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';
import LogoutButton from '../logout';
interface Order {
  _id: string;
  status: string;
  items: Array<{ name: string; quantity: number }>;
  
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
  exp: number;
}

const DeliveryDashboard = () => {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (decodedToken.role !== 'delivery') {
        router.push(`/${decodedToken.role}`);
        return;
      }
    } catch (decodeError) {
      console.error('Invalid token:', decodeError);
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }

    const fetchAssignedOrders = async () => {
      try {
        const response = await api.get('/delivery/orders');
        setAssignedOrders(response.data.orders || []);
        setLoading(false);
      } catch (fetchError) {
        console.error('Failed to fetch assigned orders:', fetchError);
        setError('Failed to load assigned orders.');
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, [router]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/delivery/orders/${orderId}/status`, { status: newStatus });
      setAssignedOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (updateError) {
      console.error('Failed to update order status:', updateError);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading your assigned orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <LogoutButton />
      <h1 className="text-4xl font-extrabold mb-8 text-blue-800 text-center">Delivery Dashboard</h1>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">Your Assigned Orders</h2>
        {assignedOrders.length === 0 ? (
          <p className="text-gray-600 text-lg text-center p-4 bg-white rounded-lg shadow-sm">
            No orders assigned to you yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedOrders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-3 text-purple-700">Order #{order._id}</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`font-bold ${
                    order.status === 'delivered' ? 'text-green-600' :
                    order.status === 'in_transit' ? 'text-blue-600' :
                    'text-orange-500'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
                  </span>
                </p>

                <p className="text-gray-700 mb-2 font-medium">Items:</p>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  {Array.isArray(order.items) ? (
                    order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x <span className="font-semibold">{item.quantity}</span>
                      </li>
                    ))
                  ) : (
                    <li>No items listed for this order.</li>
                  )}
                </ul>

                <div className="mt-4">
                  <label htmlFor={`status-${order._id}`} className="block text-gray-700 text-sm font-bold mb-2">
                    Update Status:
                  </label>
                  <select
                    id={`status-${order._id}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  >
                    <option value="pending" disabled={order.status !== 'pending'}>Pending</option>
                    <option value="assigned" disabled={order.status !== 'assigned'}>Assigned</option>
                    <option value="in_transit" disabled={order.status !== 'assigned' && order.status !== 'in_transit'}>In Transit</option>
                    <option value="delivered" disabled={order.status !== 'in_transit' && order.status !== 'delivered'}>Delivered</option>
                    <option value="cancelled" disabled={order.status !== 'pending' && order.status !== 'cancelled'}>Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;