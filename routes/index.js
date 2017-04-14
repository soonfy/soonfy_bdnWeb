var express = require('express');
var router = express.Router();

let Key = require('../app/controllers/key.js');

/* GET home page. */
router.get('/', function (req, res) {
  res.locals.msg = {}
  res.render('index', {
    title: '首页'
  })
});

router.post('/key/insert', Key.insert);

router.get('/key', Key.list);

router.get('/key/info', Key.info);

router.get('/key/count', Key.count);

router.delete('/key/remove', Key.remove);

router.get('/key/download', Key.download);

router.get('/news', Key.news);

router.get('/search', Key.search);

module.exports = router;
