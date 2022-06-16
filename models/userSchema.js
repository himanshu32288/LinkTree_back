const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String },
  groups: [{ type: mongoose.Types.ObjectId, ref: "Group" }],
  links: [{ type: mongoose.Types.ObjectId, ref: "Link" }],
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  linkedin: { type: String, default: null },
  twitter: { type: String, default: null },
  savedLink: [{ type: mongoose.Types.ObjectId, ref: "Link" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
