"use client";

import React, { useState } from 'react';
import api from '@/utils/axios'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

     
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      switch (user.role as string) { 
        case 'customer':
          router.push('/customer'); 
          break;
        case 'vendor':
          router.push('/vendor'); 
          break;
        case 'delivery':
          router.push('/delivery'); 
          break;
        default:
          router.push('/'); 
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8 animate-gradient-shift">
      <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-lg bg-gradient-to-b from-gray-100 to-white animate-fade-in">
        <div className="relative">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-slide-down">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="animate-slide-in-left">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:shadow-md"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="animate-slide-in-right">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:shadow-md"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 animate-bounce-in"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
                </svg>
              ) : null}
              Login
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 animate-fade-in">
          Don't have an account?{' '}
          <Link href="/signup">
            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Sign up
            </span>
          </Link>
        </div>
      </div>

      {/* Basic Tailwind CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounceIn {
            0% { transform: scale(0.9); opacity: 0; }
            60% { transform: scale(1.02); opacity: 1; }
            80% { transform: scale(0.98); }
            100% { transform: scale(1); }
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-down { animation: slideDown 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.7s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.7s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LoginPage;

