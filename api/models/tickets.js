const mongoose = require("mongoose");

const ticketsSchema = mongoose.Schema({
  title: { type: String, required: [true, "can't be blank"] },
  ticket_price: { type: Number, required: [true, "can't be blank"] },
  from_location: { type: String, required: [true, "can't be blank"] },
  to_location: { type: String, required: [true, "can't be blank"] },
  to_location_photo_url: { type: String, required: [true, "can't be blank"] },
  id: { type: String, required: false },
});

module.exports = mongoose.model("NodeJS_EXAM_tickets", ticketsSchema);
