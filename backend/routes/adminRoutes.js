const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Employee = require("../models/User");
const Shift = require("../models/Shifts");
const authenticateToken = require("../middleware/autheticate");
const isAdmin = require("../middleware/isAdmin");
const Availability = require("../models/Availability");

const router = express.Router();

// Get all employees with the role 'employee'
router.get("/allemployees",authenticateToken, async (req, res) => {
  if(req.user.role !== 'admin'){
    return res.status(401).json({message:'User does not have permission to access this resource'});
  }
  try {
    
    const employees = await Employee.find({ role: "employee" });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to create a shift
router.post("/shifts", async (req, res) => {
  const { username, date, startTime, endTime, timezone } = req.body; // Include timezone if needed

  try {
    // Convert start and end time to moment objects with timezone
    const shiftStart = moment.tz(`${date} ${startTime}`, "YYYY-MM-DD HH:mm", timezone);
    const shiftEnd = moment.tz(`${date} ${endTime}`, "YYYY-MM-DD HH:mm", timezone);

    // Step 1: Check if the shift falls within the employee's availability
    const availability = await Availability.findOne({ username:username, date:date });

    if (!availability) {
      return res.status(400).json({
        error: "No availability found for the user on the specified date",
      });
    }

    // Convert availability times with timezone for comparison
    const availableStart = moment.tz(
      `${availability.date} ${availability.startTime}`,
      "YYYY-MM-DD HH:mm",
      timezone
    );
    const availableEnd = moment.tz(
      `${availability.date} ${availability.endTime}`,
      "YYYY-MM-DD HH:mm",
      timezone
    );

    // Check if the shift is within the available time range
    if (shiftStart.isBefore(availableStart) || shiftEnd.isAfter(availableEnd)) {
      return res
        .status(400)
        .json({ error: "Shift is outside of the employee's availability" });
    }

    // Step 2: Check for overlapping shifts
    const overlappingShift = await Shift.findOne({
      username,
      date,
      $or: [
        // Shift starts during an existing shift
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },

        // Shift ends during an existing shift
        { startTime: { $lt: shiftEnd.format("HH:mm") }, endTime: { $gt: shiftStart.format("HH:mm") } },

        // Shift completely encompasses an existing shift
        {
          startTime: { $gte: shiftStart.format("HH:mm") },
          endTime: { $lte: shiftEnd.format("HH:mm") },
        },
      ],
    });

    if (overlappingShift) {
      return res
        .status(400)
        .json({ error: "Shift overlaps with an existing shift" });
    }

    // Step 3: If no overlap and within availability, create the shift
    const newShift = await Shift.create({
      username,
      date,
      startTime,
      endTime,
      timezone, // Save timezone for the shift if relevant
    });

    res.status(201).json({ message: "Shift created successfully!", shift: newShift });
  } catch (error) {
    console.error("Error creating shift:", error);
    res.status(500).json({ error: "Error creating shift" });
  }
});

// get shifts of employees
router.get('/shifts', async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// todo: to delete users 
// router.delete("/delete", async (req, res) => {
//   try {
//     const id = req.params.id;
//     await Employee.findByIdAndDelete(id);
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
