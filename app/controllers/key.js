let Key = require('../models/key.js');
let News = require('../models/news.js');
let Count = require('../models/count.js');

let moment = require('moment');

exports.insert = function (req, res) {
  let {keyword, tn} = req.body;
  let key = ' ' + keyword + ' ';
  console.log(key);
  if (key) {
    Key.findOne({ key: key, tn: tn }, {}, function (err, result) {
      if (err) {
        return res.redirect('/')
      } else if (result !== null) {
        return res.redirect('/')
      } else {
        let query = key.replace(/\s+-\(/g, ' #@#q4: ').replace(/\s+\(/g, ' #@#q3: ').replace(/site:/g, ' #@#site: ').replace(/\)\s+/g, ' #@# ')
        console.log(query);
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
        let _key = new Key({
          key: key,
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
        _key.save(function (err) {
          if (!err) {
            res.redirect('/')
          } else {
            res.redirect('/')
          }
        })
      }
    })
  }
}

exports.list = function (req, res) {
  let {page} = req.query
  page = page || 1
  let pages
  Key.find({ isCrawled: { $in: [0, 1, 2] } }, {}, function (err, keys) {
    if (err) {
      console.log(err);
      res.redirect('back')
    } else {
      pages = keys.length % 30 === 0 ? keys.length / 30 : parseInt(keys.length / 30 + 1);
    }
  })
  Key.find({ isCrawled: { $in: [0, 1, 2] } }, {}, { sort: { createdAt: -1 }, skip: 30 * (page - 1), limit: 30 }, function (err, keys) {
    if (err) {
      console.log(err);
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

exports.info = function (req, res) {
  let {id, page} = req.query
  let pages, key
  page = page || 1
  if (id) {
    Key.findOne({ _id: id }, {}, function (err, result) {
      if (err) {
        console.log(err);
        res.redirect('back')
      } else {
        key = result
      }
    })
    News.find({ keyId: id }, {}, function (err, news) {
      if (err) {
        console.log(err);
        res.redirect('back')
      } else {
        pages = news.length % 30 === 0 ? news.length / 30 : parseInt(news.length / 30 + 1);

        News.find({ keyId: id }, {}, { sort: { publishedAt: -1 }, skip: 30 * (page - 1), limit: 30 }, function (err, news) {
          if (err) {
            console.log(err);
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

exports.remove = function (req, res) {
  let {id} = req.query
  Key
    .remove({ _id: id }, function (err) {
      if (err) {
        console.log('remove key error.');
      }
      News.remove({keyId: id}, function (err) {
        if(err){
          console.log('remove news error.');
        }
        Count.remove({keyId: id}, function (err) {
          if(err){
            console.log('remove count error.');
          }
          res.send();
        })
      })
    })
}

exports.news = function (req, res) {
  let {page} = req.query
  let pages
  page = page || 1
  News.find({}, {}, function (err, news) {
    if (err) {
      console.log(err);
      res.redirect('back')
    } else {
      pages = news.length % 30 === 0 ? news.length / 30 : parseInt(news.length / 30 + 1);
      News.find({}, {}, { sort: { publishedAt: -1 }, skip: 30 * (page - 1), limit: 30 }, function (err, news) {
        if (err) {
          console.log(err);
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

exports.count = function (req, res) {
  let {id} = req.query
  let promise = Count.find({keyId: id}).sort({publishedAt: 1}).exec()
  promise.then(function (counts) {
    let sh = counts.shift()
    let _res = [[moment(sh.publishedAt).format('YYYY-MM-DD'), sh.count]];
    for(let _count of counts){
      let date = moment(_count.publishedAt).format('YYYY-MM-DD')
      let first = _res[0][0],
        _date = first;
      while(date !== _date){
        _date = moment(moment(_date).add(1, 'days')).format('YYYY-MM-DD')
        _res.push([_date, 0])
      }
      _res[0][1] += sh.count;
    }
    let data = _res.reverse();
    let chart = {
      title: '关键词热度',
      data
    }
    res.send(chart)
  }).catch(function(error) {
    console.log('error-', error);
    res.send()
  });
}