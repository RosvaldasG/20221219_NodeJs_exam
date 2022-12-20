const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: {
    type: String,

    required: [true, "can't be blank"],

    // match: [/([A-Z]|[a-z]|[^<>()[]\/.,;:\s@"]){6,}/, "is invalid"],
  },
  bought_tickets: { type: Array },
  money_balance: { type: Number, required: [true, "can't be blank"] },

  // reg_timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NodeJS_EXAM_users", userSchema);
