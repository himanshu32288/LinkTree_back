const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  label: { type: String, default: "" },
  link: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  clickCount: { type: Number, default: 0 },
  thumbnail: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  savedCount: { type: Number, default: 0 },
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Link", linkSchema);
