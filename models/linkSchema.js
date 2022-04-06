const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const linkSchema = new Schema({
  label: { type: String, required: true },
  image: { type: String, required: true },
  link:{type:String,required:true}, 
  click_count:{type:Number,default:0},
  like_count:{type:Number,default:0},
  Comments:[{type:mongoose.Types.ObjectId,ref:'Comment'}]
});
module.exports = mongoose.model('Link', linkSchema);