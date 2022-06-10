const User = require("../models/userSchema");
const Link = require("../models/linkSchema");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const Group = require("../models/groupSchema");
/* 
2.Create add functionality
3.Remove Functionality
*/
const createLink = async (req, res, next) => {
  const { label, image, link, creator } = req.body;

  if (!label || label.length < 3 || !link || !creator)
    return next(new HttpError("Invalid Input", 500));

  let date = new Date();
  let indianDate = date.toLocaleString("en-US", { timeZone: "IST" });

  const CreatedLink = new Link({
    label,
    image: !!image ? image : null,
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

const updateLink = async (req, res, next) => {
  const { label, image, link, userId } = req.body;
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
  userLink.image = image;
  userLink.link = link;
  await userLink.save();
  res.status(200).json({ message: "Link Updated!" });
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

const createGroup = async (req, res, next) => {
  const { label, image, creator } = req.body;
  let date = new Date().toLocaleString("en-US", { timeZone: "IST" });
  const CreatedGroup = new Group({
    label,
    image,
    creator,
    date,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating Group failed, please try again.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await CreatedGroup.save();
    await user.groups.push(CreatedGroup);
    await user.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: "Success" });
};
const addLinkToGroup = async (req, res, next) => {
  const { userId, link, groupId, label, image } = req.body;
  let userGroup;
  try {
    userGroup = await Group.findById(groupId).populate("creator", "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  if (!userGroup) {
    return next(new HttpError("No group found", 402));
  }
  if (userGroup.creator._id != userId) {
    return next(new HttpError("You are not allowed to do this action", 401));
  }
  let date = new Date().toLocaleString("en-US", { timeZone: "IST" });
  const createdLink = new Link({ label, image, link, date, userId });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await userGroup.links.push(createdLink);
    await createdLink.save();
    await userGroup.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: "Success" });
};
const removeLinkfromGrup = async (req, res, next) => {
  const {} = req.body;
};
const deleteGroup = async (req, res, next) => {
  const {} = req.body;
};

exports.createLink = createLink;
exports.deleteLink = deleteLink;
exports.updateLink = updateLink;
exports.saveLink = saveLink;
exports.increaseClick = increaseClick;
exports.createGroup = createGroup;
exports.addLinkToGroup = addLinkToGroup;
exports.removeLinkfromGrup = removeLinkfromGrup;
exports.deleteGroup = deleteGroup;
