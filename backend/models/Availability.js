const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  username: {
        type: String,
        required: true,
        unique: true
    },

    date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
});
module.exports =
  mongoose.models.Availability || mongoose.model("Availability", AvailabilitySchema);
