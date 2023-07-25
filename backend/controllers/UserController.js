const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// helper
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // Validations
    if (!name) {
      res.status(422).json({
        message: "Name field is missing",
      });
      return;
    }
    if (!email) {
      res.status(422).json({
        message: "Email field is missing",
      });
      return;
    }
    if (!phone) {
      res.status(422).json({
        message: "Phone field is missing",
      });
      return;
    }
    if (!password) {
      res.status(422).json({
        message: "Password field is missing",
      });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({
        message: "Password confirmation field is missing",
      });
      return;
    }
    if (password !== confirmpassword) {
      res.status(422).json({
        message: "Password and Password Confirmation must match",
      });
      return;
    }
    // Check if user exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({
        message: "User Already exists",
      });
      return;
    }
    // Create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a user
    const user = new User({ name, email, phone, password: passwordHash });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(422).json({
        message: "Email is missing",
      });
      return;
    }
    if (!password) {
      res.status(422).json({
        message: "Password is missing",
      });
      return;
    }
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(422).json({
        message: "No user found",
      });
      return;
    }

    // check password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(400).json({
        message: "Email or Password doesn't match",
      });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      currentUser = await User.findById(decoded.id, "-password");
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(422).json({
        message: "User not found",
      });
      return;
    }
    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = getToken(req);

    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    // validations
    if (!name) {
      res.status(422).json({
        message: "Name field is missing",
      });
      return;
    }

    if (!email) {
      res.status(422).json({
        message: "Email field is missing",
      });
      return;
    }

    // check if email has already taken
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({
        message: "Please use another email",
      });
      return;
    }

    user.email = email;

    if (!user) {
      res.status(422).json({
        message: "User not found",
      });
      return;
    }

    if (!phone) {
      res.status(422).json({
        message: "Phone field is missing",
      });
      return;
    }

    user.phone = phone;
    user.name = name;

    if (password !== confirmpassword) {
      res.status(422).json({
        message: "Password and Password Confirmation don't match",
      });
      return;
    } else if (password !== confirmpassword && password !== null) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({
        message: "User updated",
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }
  }
};
