
// Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  {AuthContext } from '../middleware/AuthContext';

const Navbar = () => {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const [user,setUser] = useState(null);
  const navigate=useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Shift Planner</Link>
        <ul className="flex space-x-4">
          {isLoggedIn ? (
            <>
              <li className="text-white">
                Welcome, {localStorage.getItem('username')} {/* Show the logged-in user's name */}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>

                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
              </li>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
