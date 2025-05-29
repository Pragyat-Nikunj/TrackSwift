"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();


  const handleLogout = () => {
    localStorage.clear(); 
    router.push('/login'); // Redirect to the login page
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 z-10" 
      aria-label="Logout" 
    >
      Logout
    </button>
  );
};

export default LogoutButton;
