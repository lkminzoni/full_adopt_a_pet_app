const jwt = require("jsonwebtoken");
const getToken = require("./get-token");
require("dotenv").config();
const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "Access Denied!",
    });
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Access Denied!",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Token invalido",
    });
  }
};

module.exports = checkToken;
