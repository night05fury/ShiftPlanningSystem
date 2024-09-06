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
    type: String, // Format: HH:mm (24-hour time)
    required: true
  },
  endTime: {
    type: String, // Format: HH:mm (24-hour time)
    required: true
  },

});
ShiftSchema.pre("save", function (next) {
  console.log("About to save shift:", this);
  next();
});

module.exports = mongoose.model("Shift", ShiftSchema);
