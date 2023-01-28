const express = require("express");
const bcrypt = require("bcryptjs");
const UserSchema = require("./user.model");

const router = express.Router();

const errorMessage = (message) => {
  return { error: true, message };
};

router.post("/signup", async (req, res) => {
  try {
    const body = req?.body;
    if (!body?.name || !body?.email || !body?.password) {
      return res.json(errorMessage("Please provide email, name and password"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const user = await UserSchema.create({
      ...body,
      password: hashedPassword,
    });
    res.json({
      error: false,
      message: "Account has been created",
      data: user.toMap(),
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: "Unable to create user account, try again",
    });
  }
});

router.post("/login", (req, res) => {
  try {
    res.json({
      message: "login",
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: "Unable to login, try again",
    });
  }
});

router.post("/login", (req, res) => {
  try {
    res.json({
      message: "login",
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: "Unable to login, try again",
    });
  }
});

module.exports = router;
