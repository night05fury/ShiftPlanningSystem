import React, {createContext, useState, useEffect} from 'react';
import {toast} from "react-hot-toast";

const AuthContext = createContext();


const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        }else{
            setIsLoggedIn(false); // User is not logged in
        }
    }, []);

    // Login function to update the user state
    const login = (userData, token) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("token", token); // Save token to localStorage
        localStorage.setItem('username', userData); // Save user data to localStorage

        //using custom react toast component for alerts
        toast.success(`Welcome Back, ${userData} !`, {
            delay: 3000, // Show the toast for 3 seconds
            position: 'top-center', // Position the toast at the top right corner
            className: 'bg-green-500 text-white rounded-md p-2', // Customize the toast appearance
        });
    };

    // Logout function to clear the user state and localStorage
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        //using custom react toast component for alerts
        toast.success(`You have been logged out`, {
            delay: 3000, // Show the toast for 3 seconds
            position: 'top-center', // Position the toast at the top right corner
            className: 'bg-green-500 text-white rounded-md p-2', // Customize the toast appearance
        });

    };

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};
