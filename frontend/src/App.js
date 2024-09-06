// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
//import Home from './components/Home'; // Assuming you have a Home component
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/Home';


const App = () => {
  return (
    
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
    
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
