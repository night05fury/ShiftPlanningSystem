const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const Availability = require("../models/Availability");
const authenticateToken = require("../middleware/autheticate");
const Shift = require("../models/Shifts");


// POST Create availability
router.post("/availability", authenticateToken, async (req, res) => {
  const { username, date, startTime, endTime, timezone } = req.body;
  console.log(' data from availability',req.body);

  try {
    // Check if the availability already exists for the employee on the given date
    let availability = await Availability.find({ username, date });

    // If availability exists, check for overlapping times
    const overlappingAvailabilities = await Availability.find({
      username,
      date,
        $nor: [
      { endTime: { $lte: startTime } },  // ThisEndTime is before document's startTime (non-overlapping)
      { startTime: { $gte: endTime } }   // ThisStartTime is after document's endTime (non-overlapping)
    ]
    });
    // If any overlapping availabilities are found, return an error
    if (overlappingAvailabilities.length > 0) {
      return res.status(400).json({ error: "Availability overlaps with an existing entry" });
    }
    

    
      // If no availability exists, create a new one
      availability = new Availability({
        username,
        date,
        startTime,
        endTime,
        timezone,
      });
    
    // Save the availability to the database
    await availability.save();
    res.status(201).json({ msg: "Availability saved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// get the availability for all the employess for admin users
router.get("/availability", async (req, res) => {
  try {
    const availabilities = await Availability.find();
    res.json(availabilities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET Fetch  availability for the logged-in employee
router.get("/myavailability", authenticateToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const availabilities = await Availability.find({ username });

    res.json(availabilities);
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});
// GET Fetch all shifts for the employee
router.get("/shifts", authenticateToken, async (req, res) => {
  try {
    const username = req.user.Username; // Assuming the username is stored in the JWT payload
    console.log(username);
    const shifts = await Shift.find({ username });
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (!shifts) {
      return res
        .status(404)
        .json({ error: "No shifts found for the employee" });
    }

    res.json(shifts);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({ error: "Error fetching shifts" });
  }
});

// GET availabilty based on selection of date and time range
router.post("/selectavailability", async (req, res) => {
  const { date, start, end } = req.body;
  try {
    const availabilities = await Availability.find({
      date,
      startTime: { $lte: start },
      endTime: { $gte: end },
    });
    res.json(availabilities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
