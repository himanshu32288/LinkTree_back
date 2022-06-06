const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  label: { type: String, required: true },
  image: { type: String, required: true },
  links:[{type:mongoose.Types.ObjectId,ref:'Link'}]
});

module.exports = mongoose.model('Group',groupSchema);