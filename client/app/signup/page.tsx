'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios'; 

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await api.post('/auth/signup', { name, email, password, role });
      console.log('Signup successful:', response.data);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 py-12 px-4 sm:px-6 lg:px-8 animate-gradient-shift">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl transform transition duration-500">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to access amazing services!
          </p>
        </div>
        <form className="mt-8 space-y-6 animate-fade-in" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px border border-gray-200">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name-signup" // Added unique name
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-signup" // Added unique name
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password-signup" // Added unique name
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                name="role-signup" // Added unique name
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled hidden>Role</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="delivery">Delivery Partner</option>
              </select>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center font-medium animate-shake">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 animate-pulse-once"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <span className='text-gray-600'>Already have an account?{' '}</span>
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-700 transition duration-200 ease-in-out">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}