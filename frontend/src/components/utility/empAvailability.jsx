import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { toast } from "react-hot-toast";

const EmployeeAvailability = () => {
  // Retrieve the token and username from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [availability, setAvailability] = useState({
    username: username, // Set the username from the token
    date: moment().startOf("week").format("YYYY-MM-DD"),
    startTime: "08:00",
    endTime: "16:00",
    timezone: moment.tz.guess(),
  });

  const [createdAvailability, setCreatedAvailability] = useState([]);
  const [error, setError] = useState("");

  const timezoneOptions = moment.tz.names().map((tz) => (
    <option key={tz} value={tz}>
      {tz}
    </option>
  ));

  const handleChange = (e) => {
    setAvailability({
      // Set the availability
      ...availability,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = moment(availability.startTime, "HH:mm");
    const end = moment(availability.endTime, "HH:mm");

    if (end.diff(start, "hours") < 4) {
      setError("Availability must be for at least 4 hours.");
      return;
    }
// Check for overlapping availability
const isOverlapping = createdAvailability.some((avail) => {
  // Check if the dates match
  if (avail.date === availability.date) {
    const existingStart = moment(avail.startTime, "HH:mm");
    const existingEnd = moment(avail.endTime, "HH:mm");

    // Check if the new availability overlaps with the existing one
    return (
      (start.isBetween(existingStart, existingEnd, undefined, "[)") ||
        end.isBetween(existingStart, existingEnd, undefined, "(]") ||
        start.isSame(existingStart) ||
        end.isSame(existingEnd)) ||
      (start.isBefore(existingStart) && end.isAfter(existingEnd))
    );
  }
  return false;
});
if (isOverlapping) {
  toast.error("Availability overlaps with an existing entry.");
  return;
}
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/availability`,
        availability,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setError("");
      toast.success("Availability created successfully!");

      // Reload availability after submission
      fetchAvailability();
    } catch (err) {
      console.error("Error creating availability:", err);
      setError("Failed to create availability");
    }
  };

  // Fetch all created availability on component mount
  const fetchAvailability = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/myavailability`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Sort the data by date, taking into account year, month, and day
      const sortedAvailability = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Parse dates to ensure they're correctly formatted
      const parsedAvailability = sortedAvailability.map((avail) => ({
        ...avail,
        date: moment(avail.date).format("YYYY-MM-DD"), // Ensuring date format
      }));

      setCreatedAvailability(parsedAvailability);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };
// delete availability
const handleDeleteAvailability = async (availabilityId) => {
 
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/employee/availability/${availabilityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    toast.success("Availability deleted successfully!");
    // Update the createdAvailability state to remove the deleted availability
    setCreatedAvailability(createdAvailability.filter((availability) => availability._id !== availabilityId));
  } catch (err) {
    console.error("Error deleting availability:", err);
    setError("Failed to delete availability");
  }
};

  useEffect(() => {
    fetchAvailability();
  }, [token]);

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Availability</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 p-8 bg-white rounded shadow-md"
      >
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label
            htmlFor="date"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Date (Start of the Week):
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={availability.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Start Time:
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={availability.startTime}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            End Time:
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={availability.endTime}
            onChange={handleChange}
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
            name="timezone"
            value={availability.timezone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {timezoneOptions}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Availability
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Your Weekly Availability</h2>
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-[400px]">
          {" "}
          {/* Add vertical scrolling */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Timezone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {createdAvailability.map((avail, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {moment(avail.date, "YYYY-MM-DD").format("dddd")}
                  </td>
                  <td className="border px-4 py-2">
                    {moment(avail.date, "YYYY-MM-DD").format("DD-MM-YYYY")}
                  </td>
                  <td className="border px-4 py-2">{avail.startTime}</td>
                  <td className="border px-4 py-2">{avail.endTime}</td>
                  <td className="border px-4 py-2">{avail.timezone}</td>
                  <td className="border px-4 py-2" ><button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" 
                  onClick={() => handleDeleteAvailability(avail._id)}>
                  Delete</button> </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAvailability;
