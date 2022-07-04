const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const { isVerified } = decodedToken;
    if (!isVerified)
      res.statsu(403).json({ message: "You need to verify your email first" });
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
