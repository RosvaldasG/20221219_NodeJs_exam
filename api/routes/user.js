const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  CREATE_USER,
  USER_LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
} = require("../controllers/user");

router.post("/createUser", CREATE_USER);

router.post("/login", USER_LOGIN);

router.get("/getNewJwtToken", GET_NEW_JWT_TOKEN);

router.get("/getAllUsers", auth, GET_ALL_USERS);

router.get("/getUserById/:id", auth, GET_USER_BY_ID);

router.get("/getAllUsersWithTickets", auth, GET_ALL_USERS_WITH_TICKETS);

router.get("/getUserByIdWithTickets/:id", auth, GET_USER_BY_ID_WITH_TICKETS);

module.exports = router;
