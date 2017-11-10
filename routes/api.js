var moment = require('moment');
var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

let KeyWordModel = require('../app/models/key.js');

router.get('/', async function (req, res) {
  // res.send({
  //   msg: '这是百度新闻 api 接口。',
  //   stamp: Date.now(),
  // });
  res.send(await KeyWordModel.find());
});

router.post('/', async function (req, res) {
  let resp = {
    statusCode: 000,
    keyword_id: '',
    msg: '',
    error: '',
    stamp: Date.now(),
  };
  try {
    let {
      keyword,
      from_id,
      start_date,
      end_date,
    } = req.body;
    console.log(from_id, keyword, start_date, end_date);
    if (from_id && keyword && start_date) {
      let doc = end_date ? { end_date: new Date(end_date), } : {};
      doc = Object.assign(doc, {
        keyword,
        from_id,
        start_date: new Date(start_date),
        crawl_status: 0,
        last_crawl_at: moment(start_date).subtract(1, 'days'),
        create_at: new Date(),
      })
      if (!doc.end_date || doc.end_date >= doc.start_date) {
        await KeyWordModel.findOneAndUpdate({ from_id: from_id }, { $set: { crawl_status: -1 } }, { multi: true });
        console.log(doc);
        let _keyword = await KeyWordModel.findOneAndUpdate({ keyword: doc.keyword, from_id: doc.from_id }, { $set: doc }, { upsert: true, new: true });
        resp = Object.assign(resp, {
          statusCode: 200,
          keyword_id: _keyword._id,
          msg: '[百度新闻] 添加关键词成功',
        });
      } else {
        resp = Object.assign(resp, {
          statusCode: 400,
          msg: '[百度新闻] 添加关键词失败',
          error: '日期区间不合法',
        });
      }
    } else {
      resp = Object.assign(resp, {
        statusCode: 400,
        msg: '[百度新闻] 添加关键词失败',
        error: 'POST 请求参数不完整',
      });
    }
  } catch (error) {
    console.error(error);
    resp = Object.assign(resp, {
      statusCode: 400,
      msg: '[百度新闻] 添加关键词失败',
      error: '服务器异常',
    });
  } finally {
    res.send(resp);
  }
});

module.exports = router;
