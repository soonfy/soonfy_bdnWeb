let KeyModel = require('../models/key.js');
let NewsModel = require('../models/news.js');
let CountModel = require('../models/count.js');

let moment = require('moment');

let path = require('path');
let fs = require('fs');
let iconv_lite = require('iconv-lite');

const domain = require('domain').create();

/**
 *  @description 添加关键词
 */
exports.insert = function (req, res) {
  res.locals.msg = {}
  let {
    title,
    keyword,
    tn
  } = req.body;
  if (!keyword.trim()) {
    res.locals.msg.err = '添加失败，关键词不能为空。'
    res.render('index', {
      title: '首页'
    })
    return;
  }
  let key = ' ' + keyword + ' ';
  if (key) {
    KeyModel.findOne({
      key: key,
      tn: tn
    }, {}, function (error, result) {
      if (error) {
        res.locals.msg.err= '添加失败，关键词不符合逻辑。'
        res.render('index', {
          title: '首页'
        })
        return;
      } else if (result !== null) {
        res.locals.msg.err = '添加失败，关键词重复。'
        res.render('index', {
          title: '首页'
        })
        return;
      } else {
        let query = key.replace(/\s+-\(/g, ' #@#q4: ').replace(/\s+\(/g, ' #@#q3: ').replace(/site:/g, ' #@#site: ').replace(/\)\s+/g, ' #@# ')
        let keys = query.split(/#@#/)
        let q1 = q3 = q4 = q6 = ''
        let s = 2
        for (let str of keys) {
          if (str.trim() && str.indexOf('q3: ') > -1) {
            q3 = str.replace('q3: ', '').trim()
          } else if (str.trim() && str.indexOf('q4: ') > -1) {
            q4 = str.replace('q4: ', '').trim()
          } else if (str.trim() && str.indexOf('site: ') > -1) {
            q6 = str.replace('site: ', '').replace('(', '').replace(')', '').trim()
          } else if (str.trim()) {
            q1 = str.trim()
          }
        }
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
          updatedAt: new Date(moment().subtract(2, 'days'))
        })
        _key.save(function (error) {
          if (!error) {
            res.locals.msg.err = '添加失败，关键词不符合逻辑。'
            res.render('index', {
              title: '首页'
            })
            return;
          } else {
            res.locals.msg.err = '添加成功。'
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
    KeyModel.find({
      isCrawled: {
        $in: [0, 1, 2]
      }
    }, function (error, keys) {
      if (error) {
        console.error(error);
        res.redirect('back')
      } else {
        pages = keys.length % 30 === 0 ? keys.length / 30 : parseInt(keys.length / 30 + 1);
        KeyModel.find({
          isCrawled: {
            $in: [0, 1, 2]
          }
        }, {}, {
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
  let pages, key
  page = page || 1
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
    NewsModel.find({
      keyId: id
    }, {}, function (error, news) {
      if (error) {
        console.error(error);
        res.redirect('back')
      } else {
        pages = news.length % 30 === 0 ? news.length / 30 : parseInt(news.length / 30 + 1);

        NewsModel.find({
          keyId: id
        }, {}, {
          sort: {
            publishedAt: -1
          },
          skip: 30 * (page - 1),
          limit: 30
        }, function (error, news) {
          if (error) {
            console.error(error);
            res.redirect('back')
          } else {
            res.render('result', {
              title: '新闻',
              news: news,
              key: key,
              pages: pages,
              page: page
            })
          }
        })
      }
    })
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
    .update({
      _id: id
    }, {
      $set: {
        isCrawled: 3
      }
    }, function (error) {
      if (error) {
        console.error('remove key error.');
      }
      NewsModel.remove({
        keyId: id
      }, function (error) {
        if (error) {
          console.error('remove news error.');
        }
        CountModel.remove({
          keyId: id
        }, function (error) {
          if (error) {
            console.error('remove count error.');
          }
          res.send();
        })
      })
    })
}

/**
 *  @description 新闻列表
 */
exports.news = function (req, res) {
  let {
    page
  } = req.query
  let pages
  page = page || 1
  NewsModel.find({}, {}, function (error, news) {
    if (error) {
      console.error(error);
      res.redirect('back')
    } else {
      pages = news.length % 30 === 0 ? news.length / 30 : parseInt(news.length / 30 + 1);
      NewsModel.find({}, {}, {
        sort: {
          publishedAt: -1
        },
        skip: 30 * (page - 1),
        limit: 30
      }, function (error, news) {
        if (error) {
          console.error(error);
          res.redirect('back')
        } else {
          res.render('news', {
            title: '新闻',
            news: news,
            pages: pages,
            page: page
          })
        }
      })
    }
  })
}

/**
 *  @description 关键词新闻统计
 */
exports.count = function (req, res) {
  let {
    id
  } = req.query
  let promise = CountModel.find({
    keyId: id
  }).sort({
    publishedAt: 1
  }).exec()
  promise.then(function (counts) {
    let data = [];
    for (let _count of counts) {
      data.push([_count.date, _count.count])
    }
    let chart = {
      title: '关键词热度',
      data
    }
    res.send(chart)
  }).catch(function (error) {
    console.error(error);
    res.send()
  });
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
  }).exec();
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
    NewsModel.find({
      keyId: id
    }, {}, {
      sort: {
        createdAt: 1
      }
    }, (error, news) => {
      let title = key.title
      let filename = `${title}.csv`
      let filepath = path.join(__dirname, '../../data', filename)
      let head = `标识,关键词,新闻标题,新闻作者,新闻摘要,新闻链接,新闻发表时间,新闻采集时间\r\n`
      head = iconv_lite.encode(head, 'gbk')
      fs.writeFileSync(filepath, head)
      news.map(_news => {
        let metas = [title, _news.key, _news.title.replace(/,/g, '，'), _news.author.replace(/,/g, '，'), _news.summary.replace(/,/g, '，'), _news.url, _news.publishedAt, _news.createdAt]
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
    })
  });
}