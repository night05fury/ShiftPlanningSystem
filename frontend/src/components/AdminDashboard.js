import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import CreateShift from './utility/createShift';

// Define an array of timezones for the dropdown (this can be extended as needed)
const timezones = moment.tz.names();

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess()); // Default to admin's timezone
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch Users and Availabilities when the component mounts
    fetchUsers();
    fetchAvailabilities();
  }, []);
// Fetch all users who have the employee role
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/allemployees');
      console.log(response.data);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users with employee role');
      console.error(err);
    }
  };
// Fetch  the availabilities of all employees
  const fetchAvailabilities = async () => {
    try {
      const response = await axios.get('/api/employee/availability');
      setAvailabilities(response.data);
      console.log(response.data);
    } catch (err) {
      setError('Failed to fetch availabilities');
      console.error(err);
    }
  };
// TODO: Implement the handleDeleteUser function
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/allemployees/${userId}`);
      setUsers(users.filter(user => user.id !== userId));  // Remove deleted user from state
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="timezone" className="block text-lg font-semibold mb-2">Select Timezone:</label>
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

      <div className="grid grid-cols-2 gap-4">
        {/* User Management */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Create Shift for Employees</h2>
            {/* Create Shift Component */}
            <CreateShift /> 
          </div>
        </div>

        {/* Availability Management */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Employee Availability Management</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2">Employee Username</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Start Time</th>
                <th className="border px-4 py-2">End Time</th>
                <th className="border px-4 py-2">Timezone</th>
                <th className="border px-4 py-2">Admin Timezone Start</th>
                <th className="border px-4 py-2">Admin Timezone End</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map(avail => {
                // Convert start and end times to the admin's selected timezone without modifying the original availability times
                const startMoment = moment.tz(`${avail.date} ${avail.startTime}`, 'YYYY-MM-DD HH:mm', avail.timezone);
                const endMoment = moment.tz(`${avail.date} ${avail.endTime}`, 'YYYY-MM-DD HH:mm', avail.timezone);

                const startInAdminTZ = startMoment.clone().tz(selectedTimezone).format('HH:mm');
                const endInAdminTZ = endMoment.clone().tz(selectedTimezone).format('HH:mm');

                return (
                  <tr key={avail.id}>
                    <td className="border px-4 py-2">{avail.name || avail.username}</td>
                    <td className="border px-4 py-2">{moment(avail.date).format("YYYY-MM-DD")}</td>
                    <td className="border px-4 py-2">{avail.startTime}</td> {/* Display original startTime */}
                    <td className="border px-4 py-2">{avail.endTime}</td> {/* Display original endTime */}
                    <td className="border px-4 py-2">{avail.timezone}</td>
                    <td className="border px-4 py-2">{startInAdminTZ}</td> {/* Converted startTime to selected timezone */}
                    <td className="border px-4 py-2">{endInAdminTZ}</td> {/* Converted endTime to selected timezone */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
