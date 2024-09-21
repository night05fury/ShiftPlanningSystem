import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


// eslint-disable-next-line react/prop-types
const CreateShift = ({ employees, onEmployeeChange,onDateChange }) => {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startTimeUTC = new Date(`${date}T${startTime}`);
      const endTimeUTC = new Date(`${date}T${endTime}`);

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/shifts`, {
        username,
        date,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
        //timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      toast.success("Shift created successfully!");
      setUsername("");
      setDate("");
      setStartTime("");
      setEndTime("");

    } catch (err) {
      console.log(err.message);
      if (err.response.status === 400) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to create shift");
        setError("Failed to create shift");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    onEmployeeChange(username);
    onDateChange(date);
  
  }, [username, onEmployeeChange, date, onDateChange]);

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-lg font-bold mb-3">Create Shift</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-4 pt-4 pb-4 mb-4 max-w-xs mx-auto"
      >
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-semibold mb-1"
            htmlFor="employee"
          >
            Employee:
          </label>
          <select
            id="employee"
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.username} value={emp.username}>
                {emp.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-semibold mb-1"
            htmlFor="date"
          >
            Date:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-semibold mb-1"
            htmlFor="start"
          >
            Start Time:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="time"
            id="start"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-semibold mb-1"
            htmlFor="end"
          >
            End Time:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="time"
            id="end"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Shift
          </button>
        </div>
      </form>

    
    </div>
  );
};



export default CreateShift;
