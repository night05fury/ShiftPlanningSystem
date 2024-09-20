// client/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/Home';
import { AuthProvider } from './middleware/AuthContext';
import ProtectedRoutes from './middleware/ProtectedRoutes';
import {Toaster} from "react-hot-toast";


const App = () => {
  return (
    <AuthProvider>

    <BrowserRouter>
      <Toaster/>
      <Navbar />
      <Routes>
      {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes */}
        <Route path='/employee/:username' element={<ProtectedRoutes>
          <EmployeeDashboard/>
        </ProtectedRoutes>}>
        </Route>
        <Route path='/admin-dashboard/:username' element={<ProtectedRoutes>
          <AdminDashboard/>
        </ProtectedRoutes>}></Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>

  );
};

export default App;