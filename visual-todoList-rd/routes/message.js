const express = require('express');
var request = require('request');
const router = express.Router();
const db = require('../db.js');

//获取文章
router.get('/getMessage',(req,res)=>{
  let sql = db.getMessage(req.query.item);
  console.log(sql);
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取杂志展示
router.get('/getMagazine',(req,res)=>{
  let sql = db.getMagazine();
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取文章成功'+data[0].content);
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取测试单词
router.get('/getWords',(req,res)=>{
  let sql = db.getWords(req.query.num);
  db.Query(sql).then(data=>{
    if(data.length){
      console.log('获取随机单词成功');
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取诗歌
router.get('/getPoetry',(req,res)=>{
  let sql = db.getPoetry();
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取文章成功'+data[0].content);
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取诗歌详情展示
router.get('/getDetails',(req,res)=>{
  let sql = db.getDetails(req.query.name);
  console.log(sql);
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取文章成功'+data[0].content);
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//高亮在学单词
router.get('/highlight',(req,res)=>{
  let sql = db.highlight(req.query.username,req.query.name);
  console.log(sql);
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取在学单词id成功');
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})

//翻译单词
router.post('/transWord',(req,res)=>{
  let word=req.body.word;
  console.log(word);
  let sql=db.transWord(req.body.isImport,req.body.word);
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('翻译成功！'+data);
      res.send({"code":"200","sucess":"翻译成功！","data":data});
    }else{
      res.send({"code":"401","error":"翻译失败！"});
    }
    },err=>{
    res.send({"code":"401","error":"翻译失败！"});
  })
});

const promise_request = (word)=>{
  return new Promise((resolve, reject)=> {
    request(`http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${word}`,function(err, response, body){
      if(err) return reject(err);
      var res = JSON.parse(body);
      var trans = '没找到';
      trans = res.translateResult[0][0].tgt;
      resolve(trans);
    })
  })
}
router.post('/youdao',(req,res)=>{
  let word=req.body.word;
  promise_request(word)
    .then(Content1 => {
        res.send({"code":"200","sucess":"翻译成功！","data":Content1});
    })
})


console.log('message接口就绪');
module.exports = router;