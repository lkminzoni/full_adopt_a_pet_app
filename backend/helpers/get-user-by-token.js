const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

// get user by jwt token

const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserByToken;
