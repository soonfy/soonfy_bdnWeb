const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountSchema = new Schema({
  keyword: {
    type: String,
    index: true
  },
  date: {
    type: Date,
  },
  count: {
    type: Number,
  },
  create_at: {
    type: Date,
  },
})

const CountModel = mongoose.model('BAIDUNEWS_COUNT', CountSchema, 'dev_baidunews_counts');

module.exports = CountModel
