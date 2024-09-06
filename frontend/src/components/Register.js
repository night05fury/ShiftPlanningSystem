import React, { useState } from "react";
import moment from "moment-timezone";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();

  const timezoneOptions = moment.tz.names().map((tz) => (
    <option key={tz} value={tz}>
      {tz}
    </option>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!username || !password || !email || !name) {
      setError("Please fill in all fields.");
      return; // Do not proceed if validation fails
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: name,
        email: email,
        username: username,
        password: password,
        role: role,
        selectedTimezone: selectedTimezone
      });

      if (response.status === 200) {
        // Registration successful
        console.log(response.data);
        // Navigate to login page after successful registration
        navigate('/login');
      } else {
        // Handle any error messages from the server
        setError(response.data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      // Catch network or server errors
      console.error(error);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 p-8 bg-white rounded shadow-md"
    >
      {error && <div className="text-red-500">{error}</div>} {/* Display error message if any */}
      
      <div>
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <div>
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <div>
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label
          htmlFor="timezone"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Timezone:
        </label>
        <select
          id="timezone"
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {timezoneOptions}
        </select>
      </div>
      
      <div>
        <label
          htmlFor="role"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Role:
        </label>
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
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
