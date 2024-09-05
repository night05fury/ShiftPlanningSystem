// client/src/components/Login.js
import React, { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword]   
   = useState('');
    const [role, setRole] = useState('employee');   
   // Default role
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // TODO:Send login request to backend with username, password, and role
      console.log('Login:', username, password, role); 
    };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-8 bg-grey rounded shadow-md">
      <div>
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input 
          type="text" 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
        <select 
          id="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button 
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Login
      </button>
    </form>
  );
};

export default Login;