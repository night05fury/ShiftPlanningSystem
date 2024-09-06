const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/User");
const Shift = require("../models/Shifts");
const authenticateToken = require("../middleware/autheticate");
const isAdmin = require("../middleware/isAdmin");


const router = express.Router();

// Get all employees with the role 'employee'
router.get("/allemployees",authenticateToken, async (req, res) => {
  if(req.user.role !== 'employee'){
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
router.post("/shifts", authenticateToken, async (req, res) => {
  const { username, date, startTime, endTime } = req.body;
  console.log(req.body);
  if(req.user.role !== 'admin'){
    return res.status(401).json({message:'User does not have permission to access this resource'});
  }
  try {
    // Check for overlapping shifts
    let shift = await Shift.findOne({
      username,
      date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
    console.log(shift);
    if (shift) {
      return res
        .status(400)
        .json({ error: "Shift overlaps with an existing shift" });
    } else {
      console.log("no overlap");
      const shift = await Shift.create({
        username,
        date,
        startTime,
        endTime,
      });
      console.log(shift);
    }

    // save the shifts to the database
    // await shift.save();
    console.log("Shift saved:", shift);

    console.log("Shift created successfully!");
    res.status(201).json({ message: "Shift created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error creating shift" });
  }
});

module.exports = router;
