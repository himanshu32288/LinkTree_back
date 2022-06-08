const User = require("../models/userSchema");
const Link = require("../models/linkSchema");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const createLink = async (req, res, next) => {
  const { label, image, link, creator } = req.body;

  if (!label || label.length < 3 || !link || !creator)
    return next(new HttpError("Invalid Input", 500));

  let date = new Date();
  let indianDate = date.toLocaleString("en-US", "Asia/Delhi");

  const CreatedLink = new Link({
    label,
    image,
    link,
    creator,
    date: indianDate,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating Link failed, please try again.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await CreatedLink.save();
    await user.links.push(CreatedLink);
    await user.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: "Success" });
};

const deleteLink = async (req, res, next) => {
  const { linkId, userId } = req.body;
  let userLink;
  try {
    userLink = await Link.findById(linkId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Link.",
      500
    );
    return next(error);
  }

  if (!userLink) {
    const error = new HttpError("Could not find Link for this id.", 404);
    return next(error);
  }
  console.log(userLink.creator._id, userId);
  if (userLink.creator._id != userId) {
    const error = new HttpError("You are not allowed to edit this Link.", 401);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await userLink.remove({ session: sess });
    await userLink.creator.links.pull(userLink);
    await userLink.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted Link." });
};

exports.createLink = createLink;
exports.deleteLink = deleteLink;
