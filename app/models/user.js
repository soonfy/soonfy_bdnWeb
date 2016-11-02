const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  pass: String,
  updatedAt: Date,
  createdAt: Date
})

//测试
const UserModel = mongoose.model('baidunews_users', UserSchema);

module.exports = UserModel
