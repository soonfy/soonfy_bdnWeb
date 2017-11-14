const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountSchema = new Schema({
  key_id: {
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

const CountModel = mongoose.model('BAIDUNEWS_COUNT', CountSchema, 'baidunews_counts');

module.exports = CountModel
