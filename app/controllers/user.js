let User = require('../models/user.js');

var crypto = require('crypto')        //核心模块，加密
let moment = require('moment')

exports.getRegister = function (req, res) {
  res.render('register', {
    title: '用户注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  })
}

exports.register = function (req, res) {
  // console.log(req.body);
  // console.log(req);
  let {name, pass, conf} = req.body;
  if (!name.trim() || !pass.trim() || !conf.trim()) {
    req.flash('error', 'name, pass or conf is not null.')
    return res.redirect('/register')
  }
  if (pass !== conf) {
    req.flash('error', 'pass is not conf.')
    return res.redirect('/register')
  }
  if (name) {
    var md5 = crypto.createHash('md5')
    pass = md5.update(pass).digest('hex')
    User.findOne({ name: name }, {}, function (err, _name) {
      if (_name === null && !err) {
        let _user = new User({
          name,
          pass,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        _user.save(function (err) {
          if (!err) {
            req.session.user = _user
            req.flash('user', name)
            req.flash('success', 'register success.')
            res.redirect('/')
          } else {
            req.flash('error', err)
            res.redirect('/register')
          }
        })
      } else if (err) {
        req.flash('error', err)
        return res.redirect('/register')
      } else {
        req.flash('error', 'the user ' + name + ' exists.')
        return res.redirect('/register')
      }
    })
  }
}

exports.getLogin = function (req, res) {
  res.render('login', {
    title: '用户登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  })
}

exports.login = function (req, res) {
  let {name, pass} = req.body;
  let md5 = crypto.createHash('md5');
  pass = md5.update(pass).digest('hex')
  User.findOne({ name: name }, {}, function (err, result) {
    if (err) {
      req.flash('error', err)
      return res.redirect('/login')
    } else if (result === null) {
      req.flash('error', 'user not exists.')
      return res.redirect('/login')
    } else if (result.pass !== pass) {
      req.flash('error', 'pass is wrong.')
      return res.redirect('/login')
    } else {
      let last = moment(result.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      result.updatedAt = new Date();
      result.save(function (err) {
        if(!err){
          req.session.user = result
          req.flash('success', 'login success. last login is ' + last)
          res.redirect('/')
        }
      })
    }
  })
}

exports.getLogout = function (req, res) {
  req.session.user = null
  req.flash('success', 'logout success.')
  res.redirect('/')
}