const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    text:{type:String,trim:true,required:true},
    date:{
        type:Date,
        default:Date.now
    },
    commentedBy:{type:String},
    commentedTo:{type:String}
});

module.exports = mongoose.model('Comment', userSchema);