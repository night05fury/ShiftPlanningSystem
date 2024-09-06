const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import User model
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
  console.log("Received Request Body:", req.body);
  const { name,email,username, password, role, selectedTimezone } = req.body;
  User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password,role} = req.body;
    
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "Invalid username or passwordv or role",
      });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password );
    const rolecheck = await bcrypt.compare( role, user.role );
    if (!isMatch && !rolecheck) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ Username:user.username, role:user.role }, process.env.JWT_SECRET,{expiresIn: '24h'});

    res.json({username,token, role });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
