const Group = require("../models/groupSchema");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Link = require("../models/linkSchema");

/* 

create group for saving related links
input->label,icon link,creater_id
*/
const createGroup = async (req, res, next) => {
  const { label, icon, creator } = req.body;
  let date = new Date().toLocaleString("en-US", { timeZone: "IST" });
  const CreatedGroup = new Group({
    label,
    icon,
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

/* 

input->label,icon,link,creater_id,group_id
functionality
validation if editor is owner the group
Push link to group
*/
const addLinkToGroup = async (req, res, next) => {
  const { userId, link, groupId, label, icon } = req.body;
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
  const createdLink = new Link({ label, icon, link, date, userId });
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

/* 

input->userId, linkId, groupId
functionality
validation if editor is owner the group
remove link from group
*/
const removeLinkfromGrup = async (req, res, next) => {
  const { userId, linkId, groupId } = req.body;
  let userGroup;
  let linktodelete;
  try {
    userGroup = await Group.findById(groupId).populate(
      "creator links",
      "-password"
    );
    linktodelete = await Link.findById(linkId);
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
  if (!userGroup) {
    return next(new HttpError("No group found", 402));
  }
  if (userGroup.creator._id != userId) {
    return next(new HttpError("You are not allowed to do this action", 401));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await userGroup.links.pull(linktodelete);
    await linktodelete.remove();
    await userGroup.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(200).json({ message: "Success" });
};
/* 

input->userId, groupId
functionality
validation if editor is owner the group
remove Group
remove all links in the group
*/
const deleteGroup = async (req, res, next) => {
  const { groupId, userId } = req.body;
  let userGroup;
  let links = [];
  try {
    userGroup = await Group.findById(groupId).populate("creator");
    for (const link of userGroup.links) {
      let find_link = await Link.findById(link);
      links.push(find_link);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Link.",
      500
    );
    return next(error);
  }

  if (!userGroup) {
    const error = new HttpError("Could not find Group for this id.", 404);
    return next(error);
  }
  if (userGroup.creator._id != userId) {
    const error = new HttpError("You are not allowed to edit this Link.", 401);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await userGroup.remove({ session: sess });
    await userGroup.creator.groups.pull(userGroup);
    await userGroup.creator.save({ session: sess });
    await Link.deleteMany({ _id: { $in: links } });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted Group." });
};

exports.createGroup = createGroup;
exports.addLinkToGroup = addLinkToGroup;
exports.removeLinkfromGrup = removeLinkfromGrup;
exports.deleteGroup = deleteGroup;
