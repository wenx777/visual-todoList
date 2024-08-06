const express = require('express');
const router = express.Router();
const db = require('../db.js');
//获取cet4词库
router.get('/cet4',(req,res)=>{
  console.log(req.query);
  let sql = db.cet4(req.query.username,req.query.id,req.query.sortMethod,req.query.findWord,req.query.filtMethod);
  console.log(sql);
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取cet4词库成功');
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取cet6词库
router.get('/cet6',(req,res)=>{
  let sql = db.cet6();
  db.Query(sql).then(data=>{
    //在数据控能够查找到结果时，将token发送给前台
    if(data.length){
      console.log('获取cet6词库成功');
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取用户个人资料
router.get('/getPerson',(req,res)=>{
  let sql = db.getPerson(req.query.username);
  console.log(sql);
  db.Query(sql).then(data=>{
    if(data.length){
      console.log('获取个人资料成功');
      res.send({"code":"200","sucess":"获取成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//修改用户个人资料
router.post('/submitMsg',(req,res)=>{
  console.log(req);
  let sql = db.submitMsg(req.body.msg);
  console.log(sql);
  db.Query(sql).then(data=>{
    if(data.length){
      console.log('修改个人资料成功');
      res.send({"code":"200","sucess":"修改成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//修改用户词库
router.post('/setLibrary',(req,res)=>{
  console.log(req);
  let sql = db.setLibrary(req.body.username,req.body.libraryAll,req.body.library);
  console.log(sql);

  db.Query(sql.sql1).then(data=>{
      console.log('修改个人资料成功');
    })

    db.Query(sql.sql2).then(data=>{
      console.log('修改个人词库成功');
    })

})
//获取用户词库
router.get('/getLibrary',(req,res)=>{
  console.log(req);
  let sql = db.getLibrary(req.query.username);
  console.log(sql);
  db.Query(sql).then(data=>{
    if(data.length){
      console.log('修改个人资料成功');
      res.send({"code":"200","sucess":"修改成功！","data":data});
    }else{
      res.send({"code":"401","error":"获取失败"});
    }
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取熟练度进度
router.get('/getDegree',(req,res)=>{
  let sql = db.getDegree(req.query.username,req.query.library);
  console.log(sql);
  db.Query(sql).then(data=>{
      console.log('获取熟练度进度成功'+data);
      res.send({"code":"200","sucess":"获取成功！","data":data});
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//获取熟练度进度
router.get('/getCollect',(req,res)=>{
  let sql = db.getCollect(req.query.username);
  console.log(sql);
  db.Query(sql).then(data=>{
      console.log('获取收藏成功'+data);
      res.send({"code":"200","sucess":"获取成功！","data":data});
    },err=>{
    res.send({"code":"401","error":"获取失败"});
  })
})
//更新单词熟练度
router.post('/updateCet',(req,res)=>{
  let sql=db.updateCet(req.body.username,req.body.engOrId,req.body.degree);
  console.log(sql);
  db.Query(sql).then(data=>{
      console.log('更改熟练度成功！');
      res.send({"code":"200","sucess":"更改成功"});
    },err=>{
    res.send({"code":"401","error":"更改失败！"});
  })
});
//更新背单词计划
router.post('/setPlan',(req,res)=>{
  let sql=db.setPlan(req.body.username,req.body.plan);
  console.log(sql);
  db.Query(sql).then(data=>{
      console.log('更改计划成功！');
      res.send({"code":"200","sucess":"更改成功"});
    },err=>{
    res.send({"code":"401","error":"更改失败！"});
  })
});
//添加收藏
router.post('/collect',(req,res)=>{
  let sql=db.collect(req.body.username,req.body.colType,req.body.name,req.body.englishName,req.body.url,req.body.imgUrl);
  console.log(sql);
  db.Query(sql).then(data=>{
      console.log('收藏作品成功！');
      res.send({"code":"200","sucess":"更改成功"});
    },err=>{
    res.send({"code":"401","error":"更改失败！"});
  })
});
console.log('personal接口就绪');
module.exports = router;