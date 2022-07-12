const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String },
  bio: { Type: String },
  groups: [{ type: mongoose.Types.ObjectId, ref: "Group" }],
  links: [{ type: mongoose.Types.ObjectId, ref: "Link" }],
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  linkedin: { type: String, default: null },
  twitter: { type: String, default: null },
  savedLink: [{ type: mongoose.Types.ObjectId, ref: "Link" }],
  isVerfied: { type: Boolean, default: false },
  verificationString: { type: String },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
