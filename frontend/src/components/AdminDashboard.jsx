
/**
 * AdminDashboard component for managing users, availabilities, and shifts.
 * 
 * @component
 * @returns {JSX.Element} The rendered AdminDashboard component.
 * 
 * @example
 * return (
 *   <AdminDashboard />
 * )
 * 
 * @description
 * This component fetches and displays users, availabilities, and shifts. It allows the admin to:
 * - View and manage employee availabilities.
 * - View and manage assigned shifts.
 * - Create new shifts for employees.
 * - Delete existing shifts.
 * - Select and change the timezone for viewing availabilities and shifts.
 * 
 * @state {Array} users - List of users with the employee role.
 * @state {Array} availabilities - List of employee availabilities.
 * @state {Array} shifts - List of assigned shifts.
 * @state {string} selectedTimezone - The selected timezone for viewing availabilities and shifts.
 * @state {string} selectedEmployee - The selected employee for filtering availabilities and shifts.
 * @state {string} selectedDate - The selected date for filtering availabilities and shifts.
 * @state {string} error - Error message for any failed fetch operations.
 * 
 * @function fetchUsers - Fetches all users with the employee role.
 * @function fetchAvailabilities - Fetches the availabilities of all employees.
 * @function fetchShifts - Fetches the shifts of all employees.
 * @function handleTimezoneChange - Handles the change of the selected timezone.
 * @function handleEmployeeChange - Handles the change of the selected employee.
 * @function handleDateChange - Handles the change of the selected date.
 * @function handleDeleteShift - Handles the deletion of a shift.
 * 
 * @filter filteredAvailabilities - Filters availabilities based on selected employee and date.
 * @filter filteredShifts - Filters shifts based on selected employee and date.
 */

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

  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
 
  const handleDeleteShift = async (shiftId) => {
    console.log( 'shiftId', shiftId);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/shifts/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });
      setShifts(shifts.filter(shift => shift._id !== shiftId));
    } catch (err) {
      setError("Failed to delete shift");
      console.error(err);
    }
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

  // Filter shifts based on selected employee and selected date
  const filteredShifts = shifts.filter((shift) => {
    const matchesEmployee = !selectedEmployee || shift.username === selectedEmployee;
    const matchesDate = !selectedDate || shift.date === selectedDate;
    return matchesEmployee && matchesDate;
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
            employees={users}
            onEmployeeChange={handleEmployeeChange} // Pass the callback function
            onDateChange={handleDateChange} // Pass the date change callback function
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
                    .tz(selectedTimezone)
                    .format("HH:mm");
                  const endInAdminTZ = endMoment
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

      {/* Assigned Shifts Management */}
      <div className="bg-white p-6 rounded shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Assigned Shifts Management</h2>
        <div className="overflow-y-auto max-h-80">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2">Employee Username</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Start Time</th>
                <th className="border px-4 py-2">End Time</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShifts.map((shift) => (
                <tr key={shift._id}>
                  <td className="border px-4 py-2">{shift.username}</td>
                  <td className="border px-4 py-2">{moment(shift.date).format("DD-MM-YY")}</td>
                  <td className="border px-4 py-2">{moment(shift.startTime).format("HH:mm")}</td>
                  <td className="border px-4 py-2">{moment(shift.endTime).format("HH:mm")}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => handleDeleteShift(shift._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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