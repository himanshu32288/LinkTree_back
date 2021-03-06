const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  label: { type: String, required: true },
  icon: { type: String, default: null },
  date: { type: Date, default: Date.now },
  links: [{ type: mongoose.Types.ObjectId, ref: "Link" }],
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Group", groupSchema);
