import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import CreateShift from "./utility/createShift";

// Define an array of timezones for the dropdown 
const timezones = moment.tz.names();

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [shifts, setShifts] = useState([]); // State for shifts
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess()); // Default to admin's timezone
  const [selectedEmployee, setSelectedEmployee] = useState(""); // State for selected employee
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch Users, Availabilities, and Shifts when the component mounts
    fetchUsers();
    fetchAvailabilities();
    fetchShifts();
  }, []);

  // Fetch all users who have the employee role
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // JSON token for the user account authentication

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/allemployees`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users with employee role");
      console.error(err);
    }
  };

  // Fetch the availabilities of all employees
  const fetchAvailabilities = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/availability`
      );
      setAvailabilities(response.data);
    } catch (err) {
      setError("Failed to fetch availabilities");
      console.error(err);
    }
  };

  // Fetch the shifts of all employees
  const fetchShifts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/shifts`
      );
      setShifts(response.data);
    } catch (err) {
      setError("Failed to fetch shifts");
      console.error(err);
    }
  };

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };
// used in the call back function below
  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
  };
// used in the call back function below
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter availabilities based on selected employee and selected date
  const filteredAvailabilities = availabilities.filter((avail) => {
    const hasShift = shifts.some(
      (shift) => shift.username === avail.username && shift.date === avail.date
    );
    const matchesEmployee = !selectedEmployee || avail.username === selectedEmployee;
    const matchesDate = !selectedDate || avail.date === selectedDate;
    return !hasShift && matchesEmployee && matchesDate;
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="timezone" className="block text-lg font-semibold mb-2">
          Select Timezone:
        </label>
        <select
          id="timezone"
          value={selectedTimezone}
          onChange={handleTimezoneChange}
          className="p-2 border rounded"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Create Shift Component */}
        <div className="bg-white p-4 rounded shadow-md lg:col-span-1">
          <h2 className="text-lg font-bold mb-4">Create Shift for Employees</h2>
          <CreateShift
            employees={users}// Pass the callback function
            onEmployeeChange={handleEmployeeChange} // Pass the callback function
            onDateChange={handleDateChange} // Pass the callback function
          />
        </div>

        {/* Availability Management */}
        <div className="bg-white p-6 rounded shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">
            Employee Availability Management
          </h2>
          <div className="overflow-y-auto max-h-80">
            {" "}
            {/* Vertical scrolling with fixed height */}
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Employee Username</th>
                  <th className="border px-4 py-2 ">Date</th>
                  <th className="border px-4 py-2">Start Time</th>
                  <th className="border px-4 py-2">End Time</th>
                  <th className="border px-4 py-2">Timezone</th>
                  <th className="border px-4 py-2">Admin Timezone Start</th>
                  <th className="border px-4 py-2">Admin Timezone End</th>
                </tr>
              </thead>
              <tbody>
                {filteredAvailabilities.map((avail) => {
                  // Convert start and end times to the admin's selected timezone without modifying the original availability times
                  const startMoment = moment.tz(avail.startTime, avail.timezone);
                  const endMoment = moment.tz(avail.endTime, avail.timezone);
                  const startInAdminTZ = startMoment
                    .clone()
                    .tz(selectedTimezone)
                    .format("HH:mm");
                  const endInAdminTZ = endMoment
                    .clone()
                    .tz(selectedTimezone)
                    .format("HH:mm");

                  return (
                    <tr key={avail._id}>
                      <td className="border px-4 py-2">{avail.username}</td>
                      <td className="border px-4 py-2 whitespace-nowrap">
                        {moment(avail.date).format("DD-MM-YY")}
                      </td>
                      <td className="border px-4 py-2">{moment(avail.startTime).format("HH:mm")}</td>{" "}
                      {/* Display original startTime */}
                      <td className="border px-4 py-2">{moment(avail.endTime).format("HH:mm")}</td>{" "}
                      {/* Display original endTime */}
                      <td className="border px-4 py-2">{avail.timezone}</td>
                      <td className="border px-4 py-2">
                        {startInAdminTZ}
                      </td>{" "}
                      {/* Converted startTime to selected timezone */}
                      <td className="border px-4 py-2">{endInAdminTZ}</td>{" "}
                      {/* Converted endTime to selected timezone */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;