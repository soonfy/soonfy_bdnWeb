let Key = require('../models/key.js');
let News = require('../models/news.js');

let moment = require('moment');

exports.insert = function (req, res) {
  let {keyword, tn} = req.body;
  let key = ' ' + keyword + ' ';
  console.log(key);
  if (key) {
    Key.findOne({ key: key, tn: tn }, {}, function (err, result) {
      if (err) {
        // req.flash('error', err)
        return res.redirect('/')
      } else if (result !== null) {
        // req.flash('error', 'key exists. ' + key)
        return res.redirect('/')
      } else {
        let query = key.replace(/\s+-\(/g, ' #@#q4: ').replace(/\s+\(/g, ' #@#q3: ').replace(/site:/g, ' #@#site: ').replace(/\)\s+/g, ' #@# ')
        console.log(query);
        let keys = query.split(/#@#/)
        let q1 = q3 = q4 = q6 = ''
        let s = 2
        for(let str of keys){
          if(str.trim() && str.indexOf('q3: ') > -1){
            q3 = str.replace('q3: ', '').trim()
          }else if(str.trim() && str.indexOf('q4: ') > -1){
            q4 = str.replace('q4: ', '').trim()
          }else if(str.trim() && str.indexOf('site: ') > -1){
            q6 = str.replace('site: ', '').replace('(', '').replace(')', '').trim()
          }else if (str.trim()){
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
            // req.flash('success', 'key insert success.')
            res.redirect('/')
          }else{
            // req.flash('err', err)
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
  Key.find({isCrawled: {$in: [0, 1, 2]}}, {}, function (err, keys) {
    if(err){
      console.log(err);
      // req.flash('err', err)
      res.redirect('back')
    }else{
      pages = keys.length % 30 === 0 ? keys.length / 30 : parseInt(keys.length / 30 + 1);
    }
  })
  Key.find({isCrawled: {$in: [0, 1, 2]}}, {}, {sort: {createdAt: -1}, skip: 30 * (page - 1), limit: 30}, function (err, keys) {
    if(err){
      console.log(err);
      // req.flash('err', err)
      res.redirect('back')
    }else{
      // req.flash('success', 'key search success.')
      res.render('key', {
        title: '关键词',
        keys: keys,
        pages: pages,
        page: page,
        // success: req.flash('success').toString(),
        // error: req.flash('error').toString()
      })
    }
  })
}

exports.info = function (req, res) {
  let {id, page} = req.query
  let pages, key
  page = page || 1
  if(id){
    Key.findOne({_id: id}, {}, function (err, result) {
      if(err){
        console.log(err);
        // req.flash('err', err)
        res.redirect('back')
      }else{
        key = result
      }
    })
    News.find({keyId: id}, {}, function (err, news) {
      if(err){
        console.log(err);
        // req.flash('err', err)
        res.redirect('back')
      }else{
        pages = news.length % 30 === 0 ? news.length / 30 : parseInt(news.length / 30 + 1);

        News.find({keyId: id}, {}, {sort: {publishedAt: -1}, skip: 30 * (page - 1), limit: 30}, function (err, news) {
          if(err){
            console.log(err);
            // req.flash('err', err)
            res.redirect('back')
          }else{
            // req.flash('success', 'news search success.')
            res.render('result', {
              title: '新闻',
              news: news,
              key: key,
              pages: pages,
              page: page,
              // success: req.flash('success').toString(),
              // error: req.flash('error').toString()
            })
          }
        })
      }
    })
  }
}

exports.news = function (req, res) {
  let {page} = req.query
  let pages, key
  page = page || 1
    Key.findOne({}, {}, function (err, result) {
      if(err){
        console.log(err);
        // req.flash('err', err)
        res.redirect('back')
      }else{
        key = result
      }
    })
    News.find({}, {}, function (err, news) {
      if(err){
        console.log(err);
        // req.flash('err', err)
        res.redirect('back')
      }else{
        pages = news.length % 30 === 0 ? news.length / 30 : parseInt(news.length / 30 + 1);
        News.find({}, {}, {sort: {publishedAt: -1}, skip: 30 * (page - 1), limit: 30}, function (err, news) {
          if(err){
            console.log(err);
            // req.flash('err', err)
            res.redirect('back')
          }else{
            // req.flash('success', 'news search success.')
            res.render('news', {
              title: '新闻',
              news: news,
              pages: pages,
              page: page,
              // success: req.flash('success').toString(),
              // error: req.flash('error').toString()
            })
          }
        })
      }
    })
    
}