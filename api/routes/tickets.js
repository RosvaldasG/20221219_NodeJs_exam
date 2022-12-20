const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { CREATE_TICKET, BUY_TICKET } = require("../controllers/tickets");

router.post("/createTicket", CREATE_TICKET);
router.get("/buyTicket", BUY_TICKET);

module.exports = router;
