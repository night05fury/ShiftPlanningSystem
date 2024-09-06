// Desc: Employee availability component that allows employees to create their weekly availability.
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";

const EmployeeAvailability = () => {
  // Retrieve the token aka username from localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  console.log(username);

  const [availability, setAvailability] = useState({
    username: username, // Set the username from the  token
    date: moment().startOf("week").format("YYYY-MM-DD"), // Start of the week (Sunday)
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

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/employee/availability",
        availability,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreatedAvailability([...createdAvailability, response.data]);
      setError("");
    } catch (err) {
      console.error("Error creating availability:", err);
      setError("Failed to create availability");
    }
  };

  // Fetch all created availability on component mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/employee/myavailability", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        console.log(response.data);
        setCreatedAvailability(response.data);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

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
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Start Time</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Timezone</th>
            </tr>
          </thead>
          <tbody>
            {createdAvailability.map((avail, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {moment(avail.date).format("dddd")}
                </td>
                <td className="border px-4 py-2">{avail.date}</td>
                <td className="border px-4 py-2">{avail.startTime}</td>
                <td className="border px-4 py-2">{avail.endTime}</td>
                <td className="border px-4 py-2">{avail.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAvailability;
