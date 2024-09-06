import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

// Get the list of all available timezones from moment.js
const timezones = moment.tz.names();

const AdminEmployeeAvailability = () => {
  const [users, setUsers] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [error, setError] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC'); // Default timezone is UTC

  useEffect(() => {
    fetchUsers();
    fetchAvailabilities();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/allemployees');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    }
  };

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

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  const getTimeInSelectedZone = (time, timezone) => {
    return moment.tz(time, selectedTimezone).format('HH:mm'); // Convert time to selected timezone
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId)); // Remove deleted user from state
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1> {/* Increased font size for the heading */}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white p-8 rounded shadow-md"> {/* Increased padding for the user management section */}
          <h2 className="text-2xl font-bold mb-4">User Management</h2> {/* Increased font size for table titles */}
          <div className="overflow-x-auto"> {/* Enables horizontal scrolling for wide tables */}
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-6 py-4 text-lg">Name</th> {/* Increased padding and text size */}
                  <th className="border px-6 py-4 text-lg">Email</th> {/* Increased padding and text size */}
                  <th className="border px-6 py-4 text-lg">Actions</th> {/* Increased padding and text size */}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="border px-6 py-4 text-lg">{user.name}</td> {/* Increased padding and text size */}
                    <td className="border px-6 py-4 text-lg">{user.email}</td> {/* Increased padding and text size */}
                    <td className="border px-6 py-4 text-lg">
                      <button className="bg-red-500 text-white px-6 py-2 rounded-lg">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Availability Management */}
        <div className="bg-white p-8 rounded shadow-md"> {/* Increased padding for the availability section */}
          <h2 className="text-2xl font-bold mb-4">Employee Availability Management</h2> {/* Increased font size for table titles */}

          {/* Timezone Dropdown */}
          <div className="mb-6">
            <label htmlFor="timezone" className="block text-lg font-medium text-gray-700">
              Select Timezone:
            </label>
            <select
              id="timezone"
              name="timezone"
              value={selectedTimezone}
              onChange={handleTimezoneChange}
              className="mt-2 block w-full pl-4 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
            >
              {timezones.map(zone => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto"> {/* Enables horizontal scrolling for wide tables */}
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {/* Days of the Week Headers */}
                  {['Employee Name', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <th key={day} className="border px-6 py-4 text-lg">{day}</th>
                  ))}
                </tr>
                <tr>
                  {/* Add dates below the day headers */}
                  {['', ...['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <th key={day} className="border px-6 py-4 text-lg">
                      {moment().startOf('week').add(i, 'days').format('YYYY-MM-DD')}
                    </th>
                  ))]}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="border px-6 py-4 text-lg">{user.name}</td>
                    {/* Loop through days of the week to display availabilities */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                      const availability = availabilities.find(
                        (avail) => avail.userId === user.id && moment(avail.date).day() === i + 1
                      );
                      return (
                        <td key={day} className="border px-6 py-4 text-lg">
                          {availability
                            ? `${getTimeInSelectedZone(availability.startTime, selectedTimezone)} - ${getTimeInSelectedZone(availability.endTime, selectedTimezone)}`
                            : 'No Availability'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeAvailability;
