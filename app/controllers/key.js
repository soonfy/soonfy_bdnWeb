let KeyModel = require('../models/key.js');
let NewsModel = require('../models/news.js');

let path = require('path');
let fs = require('fs');
let iconv_lite = require('iconv-lite');
let elasticsearch = require('elasticsearch');

let esurl = process.argv[3] || 'null';
const client = new elasticsearch.Client({
  hosts: [
    esurl
  ]
});

const domain = require('domain').create();

/**
 *  @description 添加关键词
 */
exports.insert = function (req, res) {
  res.locals.msg = {}
  let {
    title,
    q1,
    q3,
    q4,
    tn,
    date
  } = req.body;
  date = date ? new Date(date) : new Date();
  if (!(q1.trim() || q3.trim() || q4.trim())) {
    res.locals.msg.err = `需求 ${title} 添加失败。所有关键词不能同时为空。`
    res.render('index', {
      title: '首页'
    })
    return;
  }
  let key = '[' + q1 + '] + ' + q3 + ' - ' + q4;
  if (key) {
    KeyModel.findOne({
      key: key,
      tn: tn
    }, {}, function (error, result) {
      if (error) {
        res.locals.msg.err = `需求 ${title} 添加失败。`
        console.error(`find key error.`);
        res.render('index', {
          title: '首页'
        })
        return;
      } else if (result !== null) {
        res.locals.msg.err = `需求 ${title} 添加失败。所有关键词重复。`
        res.render('index', {
          title: '首页'
        })
        return;
      } else {
        let query = key.replace(/\s+-\(/g, ' #@#q4: ').replace(/\s+\(/g, ' #@#q3: ').replace(/site:/g, ' #@#site: ').replace(/\)\s+/g, ' #@# ')
        let keys = query.split(/#@#/)
        let q6 = '', s = 2
        let _key = new KeyModel({
          title,
          key,
          q1,
          q3,
          q4,
          q6,
          s,
          tn,
          isCrawled: 0,
          createdAt: new Date(),
          start: date,
          updatedAt: date
        })
        _key.save(function (error) {
          if (error) {
            res.locals.msg.err = `需求 ${title} 添加失败。`
            console.error(`save key error.`);
            res.render('index', {
              title: '首页'
            })
            return;
          } else {
            res.locals.msg.suc = `需求 ${title} 添加成功。`
            res.render('index', {
              title: '首页'
            })
            return;
          }
        })
      }
    })
  }
}

/**
 *  @description 关键词列表
 */
exports.list = function (req, res) {
  domain.run(() => {
    let {
      page
    } = req.query
    page = page || 1
    let pages;
    KeyModel.find({}, function (error, keys) {
      if (error) {
        console.error(error);
        res.redirect('back')
      } else {
        pages = keys.length % 30 === 0 ? keys.length / 30 : parseInt(keys.length / 30 + 1);
        KeyModel.find({}, {}, {
          sort: {
            createdAt: -1
          },
          skip: 30 * (page - 1),
          limit: 30
        }, function (error, keys) {
          if (error) {
            console.error(error);
            res.redirect('back')
          } else {
            res.render('key', {
              title: '关键词',
              keys: keys,
              pages: pages,
              page: page
            })
          }
        })
      }
    })
  })
  domain.on('error', (error) => {
    console.error(error);
  })
}

/**
 *  @description 展示关键词
 */
exports.info = function (req, res) {
  let {
    id,
    page
  } = req.query
  let pages, key, perPage = 30
  page = page || 1

  let searchParams = {
    index: 'baidunews_news',
    type: 'baidunews_news',
    from: (page - 1) * perPage,
    size: perPage,
    q: `keyId:${id}`
  };
  if (id) {
    KeyModel.findOne({
      _id: id
    }, {}, function (error, result) {
      if (error) {
        console.error(error);
        res.redirect('back')
      } else {
        key = result
      }
    })
    client.search(searchParams, function (error, resp) {
      if (error) {
        console.error(error);
        res.redirect('back')
      }
      res.render('result', {
        title: '关键词',
        key: key,
        news: resp.hits ? resp.hits.hits : [],
        page: page,
        pages: resp.hits ? Math.ceil(resp.hits.total / perPage) : 0
      });
    });
  }
}

/**
 *  @description 删除关键词
 */
exports.remove = function (req, res) {
  let {
    id
  } = req.query
  KeyModel
    .remove({
      _id: id
    }, function (error) {
      if (error) {
        console.error('remove key error.');
      }
      client.deleteByQuery({
        index: 'baidunews_news',
        type: 'baidunews_news',
        body: {
          query: {
            term: {
              keyId: id
            }
          }
        }
      }, function (error, response) {
        if (error) {
          console.error(error.message);
        } else {
          console.log(response);
        }
        res.send();
      });
    })
}

/**
 *  @description 查询关键词
 */
exports.search = (req, res) => {
  let {
    keyword,
    page
  } = req.query,
    pages;
  let reg = new RegExp(keyword, 'igm');
  let promise = KeyModel.find({
    $or: [{
      title: reg
    }, {
      key: reg
    }]
  }).sort({
    publishedAt: 1
  }).skip(30 * (page - 1)).limit(30).exec();
  promise.then((keys) => {
    pages = keys.length % 30 === 0 ? keys.length / 30 : parseInt(keys.length / 30 + 1);
    res.render('search', {
      title: '关键词',
      keyword: keyword,
      keys: keys,
      pages: pages,
      page: page
    })
  }).catch((error) => {
    console.error(error);
    res.redirect('back');
  })
}

/**
 *  @description 下载关键词
 */
exports.download = function (req, res) {
  let {
    id
  } = req.query
  KeyModel.findOne({
    _id: id
  }, (error, key) => {
    var allNews = [];
    client.search({
      index: 'baidunews_news',
      type: 'baidunews_news',
      scroll: '30s',
      q: `keyId:${id}`
    }, function getMoreUntilDone(error, response) {
      response.hits.hits.forEach(function (hit) {
        allNews.push(hit._source);
      });

      if (response.hits.total > allNews.length) {
        client.scroll({
          scrollId: response._scroll_id,
          scroll: '30s'
        }, getMoreUntilDone);
      } else {
        let filename = `${key.title}.csv`
        let filepath = path.join(__dirname, '../../data', filename)
        let head = `标识,关键词,新闻标题,新闻作者,新闻摘要,新闻链接,新闻发表时间,新闻采集时间\r\n`
        head = iconv_lite.encode(head, 'gbk')
        fs.writeFileSync(filepath, head)
        allNews.map(_news => {
          let metas = [key.title, key.key, _news.title.replace(/,/g, '，'), _news.author.replace(/,/g, '，'), _news.summary.replace(/,/g, '，'), _news.url, _news.publishedAt, _news.createdAt]
          let line = metas.join(',') + '\r\n'
          line = iconv_lite.encode(line, 'gbk')
          fs.appendFileSync(filepath, line)
        })
        res.download(filepath, filename, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log('download success.');
          }
        })
      }
    });
  });
}