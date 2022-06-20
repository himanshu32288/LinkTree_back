const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
  date: { type: Date, default: Date.now },
  clickCount: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Link", linkSchema);
