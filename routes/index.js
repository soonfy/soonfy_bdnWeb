var express = require('express');
var router = express.Router();

let User = require('../app/controllers/user.js');
let Key = require('../app/controllers/key.js');

//not login,goto login page
var checkLogin = function (req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'user not login.');
    res.redirect('/login');
  }else{
    next();
  }
}

//login, goto back
var checkNotLogin = function (req, res, next) {
  if (req.session.user) {
    req.flash('error', 'user already login.');
    res.redirect('back');
  }else{
    next();
  }
}

/* GET home page. */
router.get('/', checkLogin, function (req, res) {
  res.render('index', {
    title: '首页',
    user: req.session.user,  //no login
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  })
});

router.get('/register', checkNotLogin, User.getRegister);

router.post('/user/register', checkNotLogin, User.register);

router.get('/login', checkNotLogin, User.getLogin);

router.post('/user/login', checkNotLogin, User.login);

router.get('/logout', checkLogin, User.getLogout);

router.post('/key/insert', checkLogin, Key.insert);

router.get('/key', checkLogin, Key.list);

router.get('/key/info', checkLogin, Key.info);

router.get('/news', checkLogin, Key.news);

module.exports = router;
