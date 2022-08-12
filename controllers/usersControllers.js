const User = require("../models/userSchema");
const HttpError = require("../models/http-error");

const getUserByUserName = async (req, res, next) => {
  const { username } = req.params;
  let user;
  try {
    user = await User.find(
      { username: username },
      "-password --savedLinks"
    ).populate("links groups", "-clickCount -savedCount -label");
  } catch (err) {
    return next(new HttpError(err, 500));
  }
  res.status(200).json({ user });
};
const updateUserDetails = async (req, res, next) => {
  const { facebook, linkedin, twitter, instagram } = req.body;
  const userId = req.decodedToken.userId;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  user.facebook = facebook;
  user.linkedin = linkedin;
  user.twitter = twitter;
  user.instagram = instagram;
  await user.save();
  res.json({ message: "Sucess" });
};
exports.getUserByUserName = getUserByUserName;
exports.updateUserDetails = updateUserDetails;
