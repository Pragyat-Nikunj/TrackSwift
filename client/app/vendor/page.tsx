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

const VendorDashboard = () => {
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

      // Check if the token has expired
      if (decodedToken.exp * 1000 < Date.now()) {
        console.error('Token expired.');
        localStorage.removeItem('token'); 
        router.push('/login'); 
        return;
      }

      if (decodedToken.role !== 'vendor') {
        router.push(`/${decodedToken.role}`); 
        return;
      }
    } catch (decodeError) {
    
      console.error('Invalid token:', decodeError);
      localStorage.removeItem('token'); 
      router.push('/login');
      return;
    }

  
    const fetchDashboardData = async () => {
      try {
        
        const ordersResponse = await api.get('/vendor/orders');

        setOrders(ordersResponse.data.orders || []);

        setLoading(false); 
      } catch (fetchError) {

        console.error('Failed to fetch dashboard data:', fetchError);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading dashboard data...</p>
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
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Vendor Dashboard</h1>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">Your Orders</h2>
        {orders.length === 0 ? (

          <p className="text-gray-600 text-lg text-center p-4 bg-white rounded-lg shadow-sm">
            No orders found at this time.
          </p>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-sm font-semibold mb-3 text-blue-700">Order #{order._id}</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`font-bold ${order.status === 'assigned' ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                      <li>No items in this order.</li>
                    )}
                  </ul>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;