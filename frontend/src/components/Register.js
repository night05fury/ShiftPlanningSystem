// client/src/components/Register.js
import React, { useState } from "react";
import moment from "moment-timezone";
import axios from 'axios';
import { useNavigate } from "react-router-dom";



const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
const navigate=useNavigate();

  const timezoneOptions = moment.tz.names().map((tz) => (
    <option key={tz} value={tz}>
      {tz}
    </option>
  ));


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register:', username, password, role, selectedTimezone);

    axios.post('http://localhost:5000/api/auth/register', {username: username, password: password, role: role, selectedTimezone: selectedTimezone})
    .then((response) => console.log(response))
    .catch((error) =>console.error(error))
    navigate('/login');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 p-8 bg-white rounded shadow-md"
    >
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
