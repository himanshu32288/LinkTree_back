const User = require("../models/user");
const Link = require("../models/linkSchema");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const CreateLink = async (req, res, next) => {
  const { label, image, link, creator } = req.body;

  if (!label || label.length < 5 || !link || !creator)
    return next(HttpError("Invalid Input", 500));

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
    user = User.findById(creator);
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
    user.link.push(CreateLink);
    await user.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
};

exports.CreateLink = CreateLink;
