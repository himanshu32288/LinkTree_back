const User = require("../models/userSchema");
const HttpError = require("../models/http-error");

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  let user;
  try {
    user = await User.findById(userId, "-password --savedlinks").populate(
      "links groups",
      "-clickCount -savedCount"
    );
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  res.status(200).json({ user });
};

exports.getUserById = getUserById;
