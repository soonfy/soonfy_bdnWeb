const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  _id: {          //关键词_id+新闻url
    type: String,
    index: true,
    unique: true
  },
  keyId: String,  //关键词_id
  url: String,
  title: String,
  author: String,
  publishedAt: Date,
  summary: String,
  createdAt: Date
})

//测试
const NewsModel = mongoose.model('news', NewsSchema);

module.exports = NewsModel