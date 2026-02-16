const mongoose = require("mongoose");

const otp = new mongoose.Schema(
  {
    email: String,
    otp: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otp);