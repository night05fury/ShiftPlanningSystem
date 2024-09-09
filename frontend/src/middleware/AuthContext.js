
import React, { createContext, useState, useEffect } from 'react';


const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  // Check if the user is logged in by checking the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('token: ' + token);
    if (token) {
      const storedUser = (localStorage.getItem('username')); // Assuming user info is stored after login
      setUser(storedUser);
        setIsLoggedIn(true);
      console.log('user: ' + storedUser);
    }
  }, []);

  // Login function to update the user state
  const login = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("token", token); // Save token to localStorage
    localStorage.setItem('username',userData); // Save user data to localStorage
    alert(`${userData} logged in`);
  };

  // Logout function to clear the user state and localStorage
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert('You have been logged out');
    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
