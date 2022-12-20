const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const ticketsSchema = require("../models/tickets");
const userSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

// CREATE TICKET---------------------------------

module.exports.CREATE_TICKET = async (req, res) => {
  const ticket = new ticketsSchema({
    title: req.body.title,
    ticket_price: req.body.ticket_price,
    from_location: req.body.from_location,
    to_location: req.body.to_location,
    to_location_photo_url: req.body.to_location_photo_url,
  });

  ticket
    .save()
    .then((result) => {
      console.log(result);
      ticketsSchema.updateOne({ _id: ticket._id }, { id: ticket._id }).exec();
      return res.status(200).json({
        response: "Ticket was created succses",
        result,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ responce: "error" });
    });
};

// BUY TICKET-------------------------------------

module.exports.BUY_TICKET = async function (req, res) {
  const ticket = await ticketsSchema
    .findOne({ _id: req.body.ticket_id })
    .exec();

  console.log(ticket.ticket_price);

  const user = await userSchema.findOne({ _id: req.body.user_id }).exec();

  console.log(user);

  const moneyLeft = user.money_balance - ticket.ticket_price;
  console.log(moneyLeft);

  if (moneyLeft >= 0) {
    userSchema
      .updateOne(
        { _id: req.body.user_id },
        { $push: { bought_tickets: ticket._id.toString() } }
      )
      .updateOne({ _id: req.body.user_id }, { money_balance: moneyLeft })

      .then((result) => {
        res.status(200).json({ Message: "Ticket bought" });
      });
  } else {
    return res.status(400).json({ Message: "not enought money" });
  }
};
