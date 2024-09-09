// client/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
//import Home from './components/Home'; // Assuming you have a Home component
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/Home';
import { AuthProvider } from './middleware/AuthContext';
import ProtectedRoutes from './middleware/ProtectedRoutes';


const App = () => {
  return (
    <AuthProvider>

    <BrowserRouter>
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
        <Route path='/admin-dashboard' element={<ProtectedRoutes>
          <AdminDashboard/>
        </ProtectedRoutes>}></Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
    
  );
};

export default App;





















// import './App.css';
// import Login from './components/Login';
// import Navbar from './components/Navbar';
// import Register from './components/Register';

// function App() {
//   return (



//     <div className="App">
//     <div className='text-xl'>
//       <h1>This is frontend</h1>
      
//       <Login/>
//       <Register/>
//     </div>
//     </div>
//   );
// }

// export default App;
