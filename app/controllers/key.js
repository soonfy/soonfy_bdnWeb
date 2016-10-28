let Key = require('../models/key.js');

exports.insert = function (req, res) {
  let {keyword, tn} = req.body;
  keyword = keyword.trim();
  let key = [tn, keyword].join('@@@');
  if (key) {
    Key.findOne({ _id: key, tn: tn }, {}, function (err, result) {
      if (err) {
        req.flash('error', err)
        return res.redirect('/')
      } else if (result !== null) {
        req.flash('error', 'key exists. ' + key)
        return res.redirect('/')
      } else {
        let keywords = key.split('@@@')
        let query = keywords[1].trim()
        query = query.replace(/\s+-\(/g, ' #@#q4: ').replace(/\s+\(/g, ' #@#q3: ').replace(/site:/g, ' #@#site: ').replace(/\)\s+/g, ' #@# ')
        let keys = query.split(/#@#/)
        let q1 = q3 = q4 = q6 = ''
        let s = 1
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
          _id: key,
          q1,
          q3,
          q4,
          q6,
          s,
          tn,
          isCrawled: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        _key.save(function (err) {
          if (!err) {
            req.flash('success', 'key insert success.')
            res.redirect('/')
          }else{
            req.flash('err', err)
            res.redirect('/')
          }
        })
      }
    })
  }
}