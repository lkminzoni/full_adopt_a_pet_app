const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUserToken = async (user, req, res) => {
  // Creata token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );
  //   return token
  res.status(200).json({
    message: "Authentication OK",
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;
