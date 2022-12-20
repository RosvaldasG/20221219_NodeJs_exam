const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

// CREATE USER---------------------------------

module.exports.CREATE_USER = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // užkoduojama slaptažodį

  const user = new UserSchema({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    bought_tickets: [],
    money_balance: req.body.money,
  });

  const userCheck = await UserSchema.findOne({ email: req.body.email });
  console.log(userCheck);

  if (userCheck === null) {
    // tikrina ar yra toks USER
    user // jei tokio nėra tai įrašo
      .save()

      .then((result) => {
        const jwt_token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          { algorythm: "RS256" }
        );
        const jwt_refresh_token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
          { algorythm: "RS256" }
        );

        console.log(result);
        return res.status(200).json({
          response: "User was created succses",
          result,
          jwt_token,
          jwt_refresh_token,
        });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(400).json({ responce: "validation error" });
      });
  } else {
    // jei toks yra gražina klaidą
    console.log("toks vartotojas yra");
    res.status(400).json({ responce: "user already exist" });
  }
};

// USER LOGIN---------------------------------------------

module.exports.USER_LOGIN = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log(user);

    if (isPasswordMatch) {
      const jwt_token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        { algorythm: "RS256" }
      );
      const jwt_refresh_token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        { algorythm: "RS256" }
      );

      return res.status(200).json({
        status: "login successfull",
        jwt_token: jwt_token,
        jwt_refresh_token,
      });
    }
    return res.status(404).json({ status: "login failed" });
  } catch (err) {
    console.log("req.body", req.body);

    console.log("err", err);
    return res.status(404).json({ status: "login failed" });
  }
};

// getNewJwtToken -------------------------------

module.exports.GET_NEW_JWT_TOKEN = async (req, res) => {
  const jwt_refresh_token = req.headers.jwt_refresh_token;
  jwt.verify(jwt_refresh_token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      const new_jwt_token = jwt.sign(
        {
          email: decoded.email,
          userId: decoded.userId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
        { algorythm: "RS256" }
      );
      console.log(decoded.email);
      console.log(decoded.userId);

      return res.status(200).json({
        status: "JWT TOKEN refreshed",
        new_jwt_token,
        jwt_refresh_token,
      });
    } else {
      return res.status(400).json({ status: "Please Login" });
    }
  });
};

// GET ALL USERS-------------------

module.exports.GET_ALL_USERS = function (req, res) {
  UserSchema.find()
    .sort({ name: 1 })
    .then((results) => {
      // console.log(results);

      return res.status(200).json({ totalUsers: results });
    });
};

// GET USER BY ID--------------------------
module.exports.GET_USER_BY_ID = async function (req, res) {
  const jwt_token = req.headers.jwt_token;
  jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && req.params.id === decoded.userId) {
      console.log(decoded.userId);
      UserSchema.findOne({ _id: req.params.id }).then((results) => {
        // console.log(results);

        return res.status(200).json({ User: results });
      });
    } else {
      console.log("auth failed");
      return res.status(404).json({ status: "auth failed" });
    }
  });
};

// /getAllUsersWithTickets--------------------------------------

module.exports.GET_ALL_USERS_WITH_TICKETS = async function (req, res) {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "nodejs_exam_tickets",
        localField: "bought_tickets",
        foreignField: "id",
        as: "bought_tickets",
      },
    },
  ]).exec();

  console.log(data);

  return res.status(200).json({ user: data });
};

// /getUserByIdWithTickets--------------------------------------

module.exports.GET_USER_BY_ID_WITH_TICKETS = async function (req, res) {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "nodejs_exam_tickets",
        localField: "bought_tickets",
        foreignField: "id",
        as: "bought_tickets",
      },
    },
    { $match: { _id: ObjectId(req.params.id) } },
  ]).exec();

  console.log(data);

  return res.status(200).json({ user: data });
};
