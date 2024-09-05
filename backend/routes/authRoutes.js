const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import User model

const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
console.log('Received Request Body:', req.body);
  const { username, password, role, selectedTimezone } = req.body;
  User.create(req.body)
  .then (user =>res.json(user))
  .catch (err =>res.json(err))

});

module.exports = router;
