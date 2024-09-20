const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  startTime: {
    type: Date, // Format: HH:mm (24-hour time)
    required: true
  },
  endTime: {
    type: Date, // Format: HH:mm (24-hour time)
    required: true
  },

});

module.exports = 

mongoose.models.Shift || mongoose.model("Shift", ShiftSchema);
