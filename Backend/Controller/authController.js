const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");
const { createSecretToken } = require("../Token/secretToken");
module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(existingUser.username);
      return res.json({ message: "user already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "user Signed Successfully", success: true });
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All Feilds Are Required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "Incorrect Email or Passowrd" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect Email or Passowrd" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({success:true, message: "user logged in successfully" });
    next();
  } catch (error) {
    console.log(error);
  }
};
