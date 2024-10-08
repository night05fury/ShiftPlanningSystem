import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../middleware/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rolelogin, setRoleLogin] = useState("employee"); // Default role
  const [error, setError] = useState(null); // State for storing error messages
  const URL=import.meta.env.VITE_BACKEND_URL;
  const { login } = useContext(AuthContext); // Get the login function from the AuthContext

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    setError(null);

    // Check if username and password are entered
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return; // Stop submission if credentials are empty
    }

    try {
      // Send login request to backend with username, password, and role
      const role = rolelogin;
      const response = await axios.post(
        `${URL}/api/auth/login`,
        {
          username,
          password,
          role,
        }
      );

      if (response.status === 200) {
        // Handle successful login
        console.log(response.data);
        const token = response.data.token;
        localStorage.setItem("token", token); // Store the token in localStorage
        const username = response.data.username;
        localStorage.setItem("username", username); // Store the username in localStorage
        localStorage.setItem("StoreRole", rolelogin); // Store Role {admin ,employee}
        login (username, token); // Call the login function from AuthContext

        // Redirect to appropriate page based on role

          if (rolelogin === "admin") {
            navigate(`/admin-dashboard/${username}`);
          } else {

            navigate(`/employee/${username}`);
          }

      } else {
        toast.error(response.data.error);
        // Clear input fields on error
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error('Invalid credentials. Please check your username and password.');
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(error.response.data.message || 'An error occurred. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
      setUsername("");
      setPassword("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 p-8 bg-grey rounded shadow-md"
    >
      {/* Display error message */}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

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
          htmlFor="role"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Role:
        </label>
        <select
          id="role"
          value={rolelogin}
          onChange={(e) => setRoleLogin(e.target.value)}
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
