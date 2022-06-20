const User = require("../models/userSchema");
const HttpError = require("../models/http-error");

const getUserByUserName = async (req, res, next) => {
  const { username } = req.params;
  let user;
  try {
    user = await User.findById(username, "-password --savedlinks").populate(
      "links groups",
      "-clickCount -savedCount -label"
    );
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  res.status(200).json({ user });
};

exports.getUserByUserName = getUserByUserName;
