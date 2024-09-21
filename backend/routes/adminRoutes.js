/**
 * @file adminRoutes.js
 * @description This file contains the routes for admin-related operations in the Shift Planning System.
 * @module routes/adminRoutes
 */

/**
 * @route GET /allemployees
 * @description Get all employees with the role 'employee'.
 * @access Admin
 * @middleware authenticateToken
 * @returns {Object} 200 - An array of employee objects.
 * @returns {Object} 401 - Unauthorized access.
 * @returns {Object} 500 - Internal Server Error.
 */

/**
 * @route POST /shifts
 * @description Create a new shift for an employee.
 * @access Public
 * @param {string} username - The username of the employee.
 * @param {string} date - The date of the shift.
 * @param {string} startTime - The start time of the shift.
 * @param {string} endTime - The end time of the shift.
 * @param {string} timezone - The timezone of the shift.
 * @returns {Object} 201 - Shift created successfully.
 * @returns {Object} 400 - No availability found or shift overlaps with an existing shift.
 * @returns {Object} 500 - Error creating shift.
 */

/**
 * @route GET /shifts
 * @description Get all shifts.
 * @access Public
 * @returns {Object} 200 - An array of shift objects.
 * @returns {Object} 500 - Internal Server Error.
 */

/**
 * @route DELETE /shifts/:shiftId
 * @description Delete a shift by its ID.
 * @access Admin
 * @middleware authenticateToken
 * @param {string} shiftId - The ID of the shift to be deleted.
 * @returns {Object} 200 - Shift deleted successfully.
 * @returns {Object} 404 - Shift not found.
 * @returns {Object} 500 - Error deleting shift.
 */
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
router.get("/allemployees", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .json({
        message: "User does not have permission to access this resource",
      });
  }
  try {
    const employees = await Employee.find({ role: "employee" });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to create a shift
router.post("/shifts", async (req, res) => {
  const { username, date, startTime, endTime, timezone } = req.body;
  console.log("Creating shift for:", req.body);
  try {
    // Convert times to UTC or specific timezone
    const shiftStart = new Date(startTime);
    const shiftEnd = new Date(endTime);

    const availability = await Availability.findOne({ username, date });

    if (!availability) {
      return res.status(400).json({
        error: "No availability found for the user on the specified date",
      });
    }

    const availableStart = availability.startTime;
    const availableEnd = availability.endTime;

console.log("Type of availableStart:", typeof availableStart);
console.log("Type of startTime:", typeof shiftStart);
    // Log time details for debugging
    console.log(
      "Shift start:",
      shiftStart,
      "Shift end:",
      shiftEnd,
      "Availability start:",
      availableStart,
      "Availability end:",
      availableEnd
    );

    // Check if the shift is within the available time range
    if (shiftStart < availableStart || shiftEnd > availableEnd) {
      return res
        .status(400)
        .json({ error: "Shift is outside of the employee's availability" });
    }

    // Step 3: Check for overlapping shifts
    const overlappingShift = await Shift.findOne({
      username,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime },
        },
      ],
    });

    if (overlappingShift) {
      return res
        .status(400)
        .json({ error: "Shift overlaps with an existing shift" });
    }

    // Create new shift
    const newShift = await Shift.create({
      username,
      date,
      startTime: shiftStart,
      endTime: shiftEnd,
    });

    res
      .status(201)
      .json({ message: "Shift created successfully!", shift: newShift });
  } catch (error) {
    console.error("Error creating shift:", error);
    res.status(500).json({ error: "Error creating shift" });
  }
});

// Get all shifts
router.get("/shifts", async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// DELETE route to delete a shift
router.delete("/shifts/:shiftId", authenticateToken, async (req, res) => {
  console.log("Deleting shift with ID:", req.params.shiftId);
  try {
    const { shiftId } = req.params;
    console.log("Deleting shift with ID:", shiftId);
    const deletedShift = await Shift.findByIdAndDelete(shiftId);

    if (!deletedShift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    res.json({ message: "Shift deleted successfully" });
  } catch (error) {
    console.error("Error deleting shift:", error);
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
