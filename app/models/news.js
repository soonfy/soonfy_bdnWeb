const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  _id: { //时间date+关键词_id+新闻url
    type: String,
    index: true,
    unique: true
  },
  keyId: String, //关键词_id
  key: String,
  url: String,
  title: String,
  author: String,
  summary: String,
  publishedAt: Date, //新闻发布时间
  date: String,
  createdAt: Date
})

//测试
const NewsModel = mongoose.model('baidunews_news', NewsSchema);

module.exports = NewsModel