const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserSchema = require("./user.model");

const router = express.Router();

const errorMessage = (message) => {
  return { error: true, message };
};

const AuthGuard = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.json(errorMessage("Unauthorized access"));
  }
  let token =
   authorization &&authorization.startsWith("Bearer") && authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json(errorMessage("Unauthorized access"));
  }
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (e) {
    return res.status(401).json(errorMessage("Unauthorized access"));
  }
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

router.post("/login", async (req, res) => {
  try {
    const body = req?.body;
    if (!body?.email || !body?.password) {
      return res.json(errorMessage("Please provide email and password"));
    }
    const user = await UserSchema.findOne({ email: body.email });
    if (!user) {
      return res.json(errorMessage("Email or password is incorrect"));
    }
    if (!(await bcrypt.compare(body.password, user.password))) {
      return res.json(errorMessage("Email or password is incorrect"));
    }
    const result = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT,
      {
        expiresIn: "12h",
      }
    );

    res.json({
      error: false,
      message: "login was successful",
      data: {
        user: user.toMap(),
        access_token: {
          token: result,
          type: "bearer",
          expiry: "12 hours",
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
      message: "Unable to login, try again",
    });
  }
});

router.get("/profile", AuthGuard, async (req, res) => {
  try {
    const decodedUser = req.user;
    const user = await UserSchema.findById(decodedUser.id);
    res.json({
        error: false,
        message: "User profile available",
        data: user.toMap()
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: true,
      message: "Unable to login, try again",
    });
  }
});

module.exports = router;
