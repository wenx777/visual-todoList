const express = require('express');
const router = express.Router();
const db = require('../db.js');
let util = require('../util/util.js');
router.post('/login', (req, res) => {
  let username = req.body.username;
  //对密码进行加密验证
  let password = req.body.password;
  //console.log(password);（待加···）
  //生成一个token
  let token = util.encodeJwt();
  let sql = db.login(username, password);
  //生成以一个token
  db.Query(sql).then(data => {
    //在数据控能够查找到结果时，将token发送给前台
    if (data.length) {
      console.log('用户登录成功！');
      res.send({ "code": "200", "sucess": "登录成功！", "token": token, 'name': data[0].name, 'username': data[0].userId, 'wordlibrary': data[0].wordlibrary, 'plan': data[0].plan });
    } else {
      res.send({ "code": "401", "error": "账号或者密码错误，登录失败！" });
    }
  }, err => {
    res.send({ "code": "401", "error": "账号或者密码错误，登录失败！" });
  })
});

//注册用户
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  let sql = db.register(email, password);
  console.log(sql);
  db.Query(sql.sql1).then(data => {
    console.log('注册成功！' + data);
  })
});
console.log('login接口就绪');
module.exports = router;
