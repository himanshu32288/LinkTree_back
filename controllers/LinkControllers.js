const User = require("../models/userSchema");
const Link = require("../models/linkSchema");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

/* 

input->label, link, creatorId
functionality
Add links
*/
const createLink = async (req, res, next) => {
  const { label, link, creator } = req.body;

  if (!label || label.length < 3 || !link || !creator)
    return next(new HttpError("Invalid Input", 500));

  let date = new Date();
  let indianDate = date.toLocaleString("en-US", { timeZone: "IST" });

  const CreatedLink = new Link({
    label,
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

/* 

input->label, link, userId
functionality
Check editor is owner
update Link
*/
const updateLink = async (req, res, next) => {
  const { label, link, userId } = req.body;
  const { linkId } = req.params;
  let userLink;
  try {
    userLink = await Link.findById(linkId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not Edit Link.",
      500
    );
    return next(error);
  }
  //input Valdation
  if (!label || label.length < 3 || !link)
    return next(new HttpError("Invalid Input", 500));
  //Is owner of the Link
  if (userLink.creator._id != userId) {
    const error = new HttpError("You are not allowed to edit this Link.", 401);
    return next(error);
  }
  userLink.label = label;
  userLink.link = link;
  await userLink.save();
  res.status(200).json({ message: "Link Updated!" });
};

/* 

input->linkId, userId
functionality
Check editor is owner
delete Link
*/

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

/* 

input->userId,linkid
functionality
Save link to user collection
*/
const saveLink = async (req, res, next) => {
  const { userId } = req.body;
  const { linkId } = req.params;
  let saveLink;
  try {
    saveLink = await Link.findById(linkId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not save Link.",
      500
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Saving Link failed, please try again.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("You must Login First.", 401);
    return next(error);
  }
  try {
    user.savedLink.push(saveLink);
    await user.save();
  } catch (err) {
    const error = new HttpError("Saving Link Failed.", 500);
    return next(error);
  }
  try {
    saveLink.savedCount = saveLink.savedCount + 1;
    await saveLink.save();
  } catch (err) {
    const error = new HttpError("Saving Link Failed.", 500);
    return next(error);
  }
  res.status(200).json({ message: "Succes" });
};
/* 

input->linkId
functionality
Increase Count if someone clicks on the link
*/
const increaseClick = async (req, res, next) => {
  const { linkId } = req.params;
  let saveLink;
  try {
    saveLink = await Link.findById(linkId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Link.",
      500
    );
    return next(error);
  }
  saveLink.clickCount = saveLink.clickCount + 1;
  await saveLink.save();
  res.status(200).json({ message: "success" });
};

exports.createLink = createLink;
exports.deleteLink = deleteLink;
exports.updateLink = updateLink;
exports.saveLink = saveLink;
exports.increaseClick = increaseClick;
