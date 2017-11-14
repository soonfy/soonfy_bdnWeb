var moment = require('moment');
var mongoose = require('mongoose');
let elasticsearch = require('elasticsearch');

var express = require('express');
var router = express.Router();

let KeyWordModel = require('../app/models/key');
let CountModel = require('../app/models/count');

let esurl = process.argv[3] || 'null';
const client = new elasticsearch.Client({
  hosts: [
    esurl
  ]
});

router.get('/', async function (req, res) {
  // res.send({
  //   msg: '这是百度新闻 api 接口。',
  //   stamp: Date.now(),
  // });
  res.send(await KeyWordModel.find());
});

/**
 * 增改关键词
 */
router.post('/news/add', async function (req, res) {
  let resp = {
    statusCode: 000,
    keyword_id: '',
    keyword: '',
    msg: '',
    error: '',
    stamp: Date.now(),
  };
  let {
    keyword,
    from_id,
    start_date,
    end_date,
  } = req.body;
  console.log(from_id, keyword, start_date, end_date);
  try {
    if (from_id && keyword && start_date) {
      let doc = end_date ? { end_date: moment(end_date).endOf('day'), } : {};
      doc = Object.assign(doc, {
        keyword,
        from_id,
        start_date: moment(start_date).startOf('day'),
        crawl_status: 0,
        last_crawl_at: moment(start_date).subtract(1, 'days').endOf('day'),
        create_at: new Date(),
      })
      if (!doc.end_date || doc.end_date >= doc.start_date) {
        await KeyWordModel.findOneAndUpdate({ crawl_status: 0, from_id: from_id }, { $set: { crawl_status: -1, crawling_at: new Date() } });
        // let _keyword = await KeyWordModel.findOneAndUpdate({ crawl_status: 0, from_id: doc.from_id }, { $set: doc }, { upsert: true, new: true });
        let _keyword = await KeyWordModel.create(doc);
        resp = Object.assign(resp, {
          statusCode: 200,
          keyword_id: _keyword._id,
          keyword,
          msg: '[百度新闻] 添加关键词成功',
        });
      } else {
        resp = Object.assign(resp, {
          statusCode: 400,
          keyword,
          msg: '[百度新闻] 添加关键词失败',
          error: '日期区间不合法',
        });
      }
    } else {
      resp = Object.assign(resp, {
        statusCode: 400,
        keyword,
        msg: '[百度新闻] 添加关键词失败',
        error: 'POST 请求参数不完整',
      });
    }
  } catch (error) {
    console.error(error);
    resp = Object.assign(resp, {
      statusCode: 400,
      keyword,
      msg: '[百度新闻] 添加关键词失败',
      error: '服务器异常',
    });
  } finally {
    res.send(resp);
  }
});

/**
 * 删关键词
 */
router.post('/news/delete', async function (req, res) {
  let resp = {
    statusCode: 000,
    keyword_id: '',
    keyword: '',
    msg: '',
    error: '',
    stamp: Date.now(),
  };
  let {
    keyword,
    from_id,
  } = req.body;
  console.log(from_id, keyword);
  try {
    if (from_id && keyword) {
      let _keyword = await KeyWordModel.findOneAndUpdate({ keyword: keyword, from_id: from_id, crawl_status: { $gte: 0 } }, { $set: { crawl_status: -1, crawling_at: new Date() } }, { new: true });
      resp = Object.assign(resp, {
        statusCode: 200,
        keyword_id: _keyword ? _keyword._id : '关键词不存在',
        keyword,
        msg: '[百度新闻] 删除关键词成功',
      });
    } else {
      resp = Object.assign(resp, {
        statusCode: 400,
        keyword,
        msg: '[百度新闻] 删除关键词失败',
        error: 'DELETE 请求参数不完整',
      });
    }
  } catch (error) {
    console.error(error);
    resp = Object.assign(resp, {
      statusCode: 400,
      keyword,
      msg: '[百度新闻] 删除关键词失败',
      error: '服务器异常',
    });
  } finally {
    res.send(resp);
  }
});

/**
 * 根据关键词查询count
 */
router.post('/news/get', async function (req, res) {
  let resp = {
    statusCode: 000,
    keyword_id: '',
    keyword: '',
    news: [],
    msg: '',
    error: '',
    stamp: Date.now(),
  };
  let {
    keyword,
    from_id,
    start_date,
    end_date,
  } = req.body;
  console.log(from_id, keyword);
  try {
    if (from_id && keyword && start_date && end_date) {
      let start = moment(start_date).startOf('day'),
        end = moment(end_date).endOf('day');
      let _keyword = await KeyWordModel.findOne({ keyword: keyword, from_id: from_id, crawl_status: { $gte: 0 } });
      if (_keyword) {
        let counts = await CountModel.find({ key_id: _keyword._id, date: { $gte: start, $lte: end } }, { key_id: 1, date: 1, count: 1, create_at: 1 }, { sort: { date: 1 } });
        resp = Object.assign(resp, {
          statusCode: 200,
          keyword_id: _keyword._id,
          keyword,
          news: counts,
          msg: '[百度新闻] 查询关键词成功',
        });
      } else {
        resp = Object.assign(resp, {
          statusCode: 400,
          keyword,
          msg: '[百度新闻] 查询关键词失败',
          error: 'GET 请求没有匹配到关键词',
        });
      }
    } else {
      resp = Object.assign(resp, {
        statusCode: 400,
        keyword,
        msg: '[百度新闻] 查询关键词失败',
        error: 'GET 请求参数不完整',
      });
    }
  } catch (error) {
    console.error(error);
    resp = Object.assign(resp, {
      statusCode: 400,
      keyword,
      msg: '[百度新闻] 查询关键词失败',
      error: '服务器异常',
    });
  } finally {
    res.send(resp);
  }
});

/**
 * 根据关键词查status
 */
router.post('/news/status', async function (req, res) {
  let resp = {
    statusCode: 000,
    keyword_id: '',
    keyword: '',
    status: '',
    msg: '',
    error: '',
    stamp: Date.now(),
  };
  let {
    keyword,
    from_id,
    start_date,
    end_date,
  } = req.body;
  console.log(from_id, keyword);
  try {
    if (from_id && keyword && start_date && end_date) {
      let start = moment(start_date).startOf('day'),
        end = moment(end_date).endOf('day');
      let _keyword = await KeyWordModel.findOne({ keyword: keyword, from_id: from_id, crawl_status: { $gte: 0 } });
      if (_keyword) {
        if (_keyword.start_date <= start) {
          if (_keyword.last_crawl_at >= end) {
            resp = Object.assign(resp, {
              statusCode: 200,
              keyword_id: _keyword._id,
              keyword,
              status: '数据完整',
              msg: '[百度新闻] 查询关键词状态成功',
            });
          } else if (!_keyword.end_date || _keyword.end_date >= end) {
            resp = Object.assign(resp, {
              statusCode: 400,
              keyword_id: _keyword._id,
              keyword,
              status: '数据不完整',
              msg: '[百度新闻] 查询关键词状态失败',
              error: '数据更新到' + moment(_keyword.last_crawl_at).format('YYYY-MM-DD'),
            });
          } else {
            resp = Object.assign(resp, {
              statusCode: 400,
              keyword_id: _keyword._id,
              keyword,
              status: '数据不完整',
              msg: '[百度新闻] 查询关键词状态失败',
              error: '查询结束时间(' + end_date + ')大于结束监测时间(' + moment(_keyword.end_date).format('YYYY-MM-DD') + ')',
            });
          }
        } else {
          resp = Object.assign(resp, {
            statusCode: 400,
            keyword_id: _keyword._id,
            keyword,
            status: '数据不完整',
            msg: '[百度新闻] 查询关键词状态失败',
            error: '查询开始时间(' + start_date + ')小于开始监测时间(' + moment(_keyword.start_date).format('YYYY-MM-DD') + ')',
          });
        }
      } else {
        resp = Object.assign(resp, {
          statusCode: 400,
          keyword,
          msg: '[百度新闻] 查询关键词状态失败',
          error: 'STATUS 请求没有匹配到关键词',
        });
      }
    } else {
      resp = Object.assign(resp, {
        statusCode: 400,
        keyword,
        msg: '[百度新闻] 查询关键词状态失败',
        error: 'GET 请求参数不完整',
      });
    }
  } catch (error) {
    console.error(error);
    resp = Object.assign(resp, {
      statusCode: 400,
      keyword,
      msg: '[百度新闻] 查询关键词状态失败',
      error: '服务器异常',
    });
  } finally {
    res.send(resp);
  }
});

/**
 * 根据关键词查文章
 */
router.post('/news/content', async function (req, res) {
  let resp = {
    statusCode: 000,
    keyword_id: '',
    keyword: '',
    total: 0,
    news: [],
    msg: '',
    error: '',
    stamp: Date.now(),
  };
  let {
    keyword,
    from_id,
    start_date,
    end_date,
  } = req.body;
  console.log(from_id, keyword, start_date, end_date);
  try {
    if (from_id && keyword && start_date && end_date) {
      let start = moment(start_date).startOf('day'),
        end = moment(end_date).endOf('day');
      let _keyword = await KeyWordModel.findOne({ keyword: keyword, from_id: from_id, crawl_status: { $gte: 0 } });
      if (_keyword) {
        let searchParams = {
          index: 'baidunews_news',
          type: 'baidunews_news',
          body: {
            query: {
              bool: {
                "must": [
                  {
                    "term": {
                      "keyId": _keyword._id
                    }
                  },
                  {
                    "range": {
                      "publishedAt": {
                        "gte": moment(start_date).startOf('day'),
                        "lte": moment(end_date).endOf('day')
                      }
                    }
                  },
                ],
              }
            },
            "sort": {
              "publishedAt": {
                "order": "desc"
              }
            },
            "size": 3000
          },
        }
        let result = await client.search(searchParams);
        resp = Object.assign(resp, {
          statusCode: 200,
          keyword_id: _keyword._id,
          keyword,
          total: result.hits.total,
          news: result.hits.hits.map(x => {
            return {
              id: x._id,
              author: x._source.author,
              title: x._source.title,
              summary: x._source.summary,
              date: moment(x._source.publishedAt).format('YYYY-MM-DD'),
              url: x._source.url,
            }
          }),
          msg: '[百度新闻] 查询关键词content成功',
        });
      } else {
        resp = Object.assign(resp, {
          statusCode: 400,
          keyword,
          msg: '[百度新闻] 查询关键词状态失败',
          error: 'STATUS 请求没有匹配到关键词',
        });
      }
    } else {
      resp = Object.assign(resp, {
        statusCode: 400,
        keyword,
        msg: '[百度新闻] 查询关键词状态失败',
        error: 'GET 请求参数不完整',
      });
    }
  } catch (error) {
    console.error(error);
    resp = Object.assign(resp, {
      statusCode: 400,
      keyword,
      msg: '[百度新闻] 查询关键词状态失败',
      error: '服务器异常',
    });
  } finally {
    res.send(resp);
  }
});

module.exports = router;