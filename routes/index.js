var express = require('express');
var router = express.Router();

let Key = require('../app/controllers/key.js');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: '首页',
    // success: req.flash('success').toString(),
    // error: req.flash('error').toString()
  })
});

router.post('/key/insert', Key.insert);

router.get('/key', Key.list);

router.get('/key/info', Key.info);

router.delete('/key/remove', Key.remove)

router.get('/news', Key.news);

module.exports = router;
