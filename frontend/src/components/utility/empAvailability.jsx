/**
 * EmployeeAvailability component allows users to create, view, and delete their availability.
 * It fetches existing availability and assigned shifts from the backend and displays them in a table.
 * Users can create new availability by filling out a form and submitting it.
 * The component ensures that the availability does not overlap with existing entries and is at least 4 hours long.
 * 
 * @component
 * @returns {JSX.Element} The EmployeeAvailability component.
 * 
 * @example
 * return (
 *   <EmployeeAvailability />
 * )
 * 
 * @function
 * @name EmployeeAvailability
 * 
 * @description
 * - Fetches existing availability and assigned shifts on mount.
 * - Allows users to create new availability by submitting a form.
 * - Ensures that the new availability does not overlap with existing entries and is at least 4 hours long.
 * - Displays existing availability in a table with options to delete entries.
 * 
 * @state {Object} availability - The state object for the availability form.
 * @state {Array} createdAvailability - The state array for storing created availability entries.
 * @state {Array} assignedShifts - The state array for storing assigned shifts.
 * @state {string} error - The state string for storing error messages.
 * 
 * @function handleChange - Handles input changes for the availability form.
 * @param {Object} e - The event object.
 * 
 * @function handleSubmit - Handles form submission for creating new availability.
 * @param {Object} e - The event object.
 * 
 * @function fetchAvailability - Fetches existing availability from the backend.
 * 
 * @function fetchAssignedShifts - Fetches assigned shifts from the backend.
 * 
 * @function handleDeleteAvailability - Handles deletion of an availability entry.
 * @param {string} availabilityId - The ID of the availability entry to delete.
 * 
 * @function isShiftAssigned - Checks if a shift is assigned for a given availability entry.
 * @param {Object} avail - The availability entry to check.
 * @returns {boolean} - Returns true if a shift is assigned, otherwise false.
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { toast } from "react-hot-toast";

const EmployeeAvailability = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [availability, setAvailability] = useState({
    username: username,
    startTime: "08:00",
    endTime: "16:00",
    date: moment().format("YYYY-MM-DD"), // Default to current date
    timezone: moment.tz.guess(),
  });

  const [createdAvailability, setCreatedAvailability] = useState([]);
  const [assignedShifts, setAssignedShifts] = useState([]);
  const [error, setError] = useState("");

  // Timezone options for the dropdown
  const timezoneOptions = moment.tz.names().map((tz) => (
    <option key={tz} value={tz}>
      {tz}
    </option>
  ));

  // Handle input changes
  const handleChange = (e) => {
    setAvailability({
      ...availability,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine the date with the time inputs to form proper Date objects
    const startDateTime = new Date(`${availability.date}T${availability.startTime}`);
    const endDateTime = new Date(`${availability.date}T${availability.endTime}`);

   // !If end time is earlier than start time, it means availability goes to the next day
  if (endDateTime <= startDateTime) {
    // Increment the end date by one day
    endDateTime.setDate(endDateTime.getDate() + 1);
  }

  // !Make sure the duration is at least 4 hours
  if (endDateTime - startDateTime < 4 * 60 * 60 * 1000) {
    //setError("Availability must be for at least 4 hours.");
    toast.error("Availability must be at least 4 hours");
    return;
  }
    // Check for overlap with existing availability
    const isOverlapping = createdAvailability.some((avail) => {
      if (avail.date === availability.date) {
        const existingStart = new Date(`${avail.date}T${avail.startTime}`);
        const existingEnd = new Date(`${avail.date}T${avail.endTime}`);

        return (
          (startDateTime >= existingStart && startDateTime < existingEnd) ||
          (endDateTime > existingStart && endDateTime <= existingEnd) ||
          (startDateTime <= existingStart && endDateTime >= existingEnd)
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
        {
          username: availability.username,
          startTime: startDateTime,
          endTime: endDateTime,
          date:availability.date,
          timezone: availability.timezone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError("");
      toast.success("Availability created successfully!");
      fetchAvailability();
    } catch (err) {
      console.log(err.message);
      if(err.response.status === 400){
        toast.error("Availability overlaps with an existing entry.");
      }
      // console.error("Error creating availability:", err);
      // setError("Failed to create availability");
    }
  };

  // Fetch availability data from the backend
  const fetchAvailability = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/myavailability`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedAvailability = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setCreatedAvailability(sortedAvailability);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  // Fetch assigned shifts for the employee
  const fetchAssignedShifts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/shifts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignedShifts(response.data);
    } catch (err) {
      console.error("Error fetching assigned shifts:", err);
    }
  };

  // Handle availability deletion
  const handleDeleteAvailability = async (availabilityId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/employee/availability/${availabilityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Availability deleted successfully!");
      setCreatedAvailability(
        createdAvailability.filter(
          (availability) => availability._id !== availabilityId
        )
      );
    } catch (err) {
      console.error("Error deleting availability:", err);
      setError("Failed to delete availability");
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchAssignedShifts();
  }, [token]);

  // Check if a shift is assigned
  const isShiftAssigned = (avail) => {
    return assignedShifts.some((shift) => {
      return (
        shift.date === avail.date &&
        moment(shift.startTime).isSameOrAfter(avail.startTime) &&
        moment(shift.endTime).isSameOrBefore(avail.endTime)
      );
    });
  };

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
            Date:
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
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Timezone</th>
                <th className="px-4 py-2">Assigned</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {createdAvailability.map((avail, index) => (
                <tr
                  key={index}
                  className={isShiftAssigned(avail) ? "bg-green-200" : ""}
                >
                  <td className="border px-4 py-2">
                    {moment(avail.date).format("dddd")}
                  </td>
                  <td className="border px-4 py-2">
                    {moment(avail.date).format("DD-MM-YYYY")}
                  </td>
                  <td className="border px-4 py-2">
                    {moment(avail.startTime).format("HH:mm")}
                  </td>
                  <td className="border px-4 py-2">
                    {moment(avail.endTime).format("HH:mm")}
                  </td>
                  <td className="border px-4 py-2">{avail.timezone}</td>
                  <td className="border px-4 py-2">
                    {isShiftAssigned(avail) ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    {isShiftAssigned(avail) ? (
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-grey-600"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDeleteAvailability(avail._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
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
