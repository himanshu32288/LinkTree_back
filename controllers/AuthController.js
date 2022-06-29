const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { sendMail } = require("../utils/sendMail");
const HttpError = require("../models/http-error");
const User = require("../models/userSchema");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password, username } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User Email exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }
  //Verificationn String
  const verificationString = v4();

  const createdUser = new User({
    email,
    username,
    verificationString,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  //Sending Mail
  try {
    sendMail({
      to: email,
      from: "himanshukumar_2k19co159@dtu.ac.in",
      subject: "Verify Email",
      text: `Thanks for signing up!To verify your email click on the below link
https://localhost:3000/verify-email/${verificationString}
      `,
    });
  } catch (err) {
    throw new Error(err);
  }
  let token;
  try {
    token = jwt.sign(
      { username: createdUser.username, email: createdUser.email },
      process.env.SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ token: token });
};

const login = async (req, res, next) => {
  const { userNameOrEmail, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      $or: [{ email: userNameOrEmail }, { username: userNameOrEmail }],
    });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { username: existingUser.username, email: existingUser.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ token });
};

const checkUserExist = async (req, res, next) => {
  const { username } = req.params;
  let user;
  try {
    user = await user.findOne({ username });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  res.status(200).json({ hasUser: !!user });
};

exports.signup = signup;
exports.login = login;
exports.checkUserExist = checkUserExist;
