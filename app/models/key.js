const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeySchema = new Schema({
  _id: {                // keys-西游 伏妖 (周星驰 | 徐克) -(西游降魔 | 大闹天宫) site(人民网 | 新华网)
    type: String,
    index: true,
    unique: true
  },
  tn: {                 //newsdy-全文，newstitledy-标题
    type: String,
    default: 'newsdy'
  },
  q1: {                 //and，关键词之间+
    type: String,
    default: ''
  },
  q3: {                 //or，关键词之间+
    type: String,
    default: ''
  },
  q4: {                 //not，关键词之间+
    type: String,
    default: ''
  },
  q6: {                 //限定新闻来源
    type: String,
    default: ''
  },
  s: {                  //1-限定时间，2-全部时间
    type: Number,
    default: 2
  },
  isCrawled: {          //0-等待采集，1-正在采集
    type: Number,
    default: 0
  },
  updatedAt: Date,
  createdAt: Date
})

//测试
const KeyModel = mongoose.model('keys', KeySchema);

module.exports = KeyModel
