const express = require('express');
const router = express.Router();
const db = require('../db.js');

//获取视频字幕和翻译
router.get('/getMovie',(req,res)=>{
  let sql = db.getMovie(req.query.movie);
  console.log(sql);
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取字幕成功'+data[0].end);
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})

console.log('movie接口就绪');
module.exports = router;