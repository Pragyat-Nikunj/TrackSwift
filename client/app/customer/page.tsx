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
  vendorId?: {
    _id: string;
    name: string;
  };
  deliveryPartnerId?: {
    _id: string;
    name: string;
  };
  items: Array<{ name: string; quantity: number }>;
  createdAt: string;
}


interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
  exp: number; 
}

const CustomerDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]); 
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

      if (decodedToken.exp * 1000 < Date.now()) {
        console.error('Token expired.');
        localStorage.removeItem('token'); 
        router.push('/login'); 
        return;
      }

      if (decodedToken.role !== 'customer') {
        router.push(`/${decodedToken.role}`); 
        return;
      }
    } catch (decodeError) {
      console.error('Invalid token:', decodeError);
      localStorage.removeItem('token'); 
      router.push('/login'); 
      return;
    }

    
    const fetchCustomerOrders = async () => {
      try {

        const ordersResponse = await api.get('/customer/orders');

        setOrders(ordersResponse.data.orders || []);

        setLoading(false); 
      } catch (fetchError) {
        console.error('Failed to fetch customer orders:', fetchError);
        setError('Failed to load your orders. Please try again.');
        setLoading(false);
      }
    };

    fetchCustomerOrders(); 
  }, [router]); 
  
  const handleTrackOrder = (orderId: string) => {
    router.push(`/track?orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading your orders...</p>
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
      <h1 className="text-4xl font-extrabold mb-8 text-green-800 text-center">Customer Dashboard</h1>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">Your Orders</h2>
        {orders.length === 0 ? (
         
          <p className="text-gray-600 text-lg text-center p-4 bg-white rounded-lg shadow-sm">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-indigo-700">Order #{order._id}</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`font-bold ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'cancelled' ? 'text-red-600' :
                      order.status === 'in_transit' ? 'text-blue-600' :
                      'text-orange-500'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
                    </span>
                  </p>
                  {order.vendorId && (
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">From Vendor:</span> {order.vendorId.name}
                    </p>
                  )}
                  {order.deliveryPartnerId && (
                    <p className="text-gray-700 mb-4">
                      <span className="font-medium">Delivery Partner:</span> {order.deliveryPartnerId.name}
                    </p>
                  )}

                  <p className="text-gray-700 mb-2 font-medium">Items:</p>
                  <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x <span className="font-semibold">{item.quantity}</span>
                        </li>
                      ))
                    ) : (
                      <li>No items listed for this order.</li>
                    )}
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleTrackOrder(order._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;