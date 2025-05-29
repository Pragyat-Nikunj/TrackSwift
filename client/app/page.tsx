"use client"; 
import React from 'react';
import { useRouter } from 'next/navigation'; 

const HomePage = () => {
  const router = useRouter(); 

  
  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 lg:p-12 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
      
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-indigo-600">Track Swift</span>
        </h1>

      
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          Your seamless solution for efficient order management and delivery tracking.
        </p>

       
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        
          <button
            onClick={handleLoginClick}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>

         
          <button
            onClick={handleSignupClick}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;