import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone'; // To format date and time

const EmployeeShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the employee's shifts when the component mounts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT token is stored in localStorage
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/employee/shifts`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token for authentication
            },
          }
        );

        // Sort the shifts by date before setting them in state
        const sortedShifts = response.data.sort((a, b) =>
          moment(a.date).isAfter(moment(b.date)) ? 1 : -1
        );

        setShifts(sortedShifts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch shifts');
        setLoading(false);
        console.error(err);
      }
    };

    fetchShifts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Shifts</h1>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Day</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Start Time</th>
            <th className="border px-4 py-2">End Time</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift._id}>
              <td className="border px-4 py-2">
                {moment(shift.date).format('dddd')}
              </td>
              <td className="border px-4 py-2">
                {moment(shift.date).format('DD-MM-YYYY')}
              </td>
              <td className="border px-4 py-2">
                {moment(shift.startTime).format('HH:mm')}
              </td>
              <td className="border px-4 py-2">
                {moment(shift.endTime).format('HH:mm')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeShifts;
