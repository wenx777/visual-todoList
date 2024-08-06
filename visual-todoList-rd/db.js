const { json } = require('body-parser');
const { JsonWebTokenError } = require('jsonwebtoken');
let mysql=require('mysql');
// 创建连接池，效率更高，不需要每次操作数据库都创建连接
let pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'wx123456',
    database:'USER_INFO',
    port:3306,
    connectionLimit:50,//允许连接数
    multipleStatements : true,  //是否允许执行多条sql语句
    timezone:"08:00" //大坑，必须加这一句，否则时间不对劲
})
//封装数据库sql请求操作，返回的是一个包含对象的数组
let Query=( sql , ...params )=>{
     return new Promise(function(resolve,reject){
         //从连接池中拿一条链接
         pool.getConnection(function(err,connection){
            if(err){
                return reject(err);
            }
            connection.query( sql , params , function(error,res){
                // console.log(res);
                pool.releaseConnection(connection)
                if(error){
                    return reject(error);
                }
                return resolve(res);
            });
        });
    });
 };

//用户sql语句

    //登录验证
    let login = function(username,password){
        let sql = `
        select
            *
        from
            message
        where
            message.username='${username}' and  message.password='${password}'
        `;
        return sql;
    }
    //注册用户
    let register = function(email, password){
      const sql = `INSERT into message (email,password,nickname) values('${email}','${password}',CONCAT('用户',FLOOR( 100 + RAND() * (1000 - 100))));`

      return sql;
    }
    //创建用户数据库
    //sql.sql2 = `SET NAMES utf8mb4;SET FOREIGN_KEY_CHECKS = 0;DROP TABLE IF EXISTS ${username};CREATE TABLE ${username} (id int NOT NULL,degree int DEFAULT NULL,PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;SET FOREIGN_KEY_CHECKS = 1;`
    let register2 = function(userId){
      var sql = {sql1:'',sql2:'',sql3:''}
      sql.sql1 = `update message set userId = 'user${userId}' where id = ${userId}`
      sql.sql2 = `SET NAMES utf8mb4;SET FOREIGN_KEY_CHECKS = 0;DROP TABLE IF EXISTS user${userId};CREATE TABLE user${userId} (id int NOT NULL,degree int DEFAULT NULL,PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;SET FOREIGN_KEY_CHECKS = 1;`
      sql.sql3 = `ALTER TABLE user${userId} ADD CHECK(degree>=0 AND degree<10)`
      return sql;
    }
    //初始化词库
    //sql.sql2 = `SET NAMES utf8mb4;SET FOREIGN_KEY_CHECKS = 0;DROP TABLE IF EXISTS ${username};CREATE TABLE ${username} (id int NOT NULL,degree int DEFAULT NULL,PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;SET FOREIGN_KEY_CHECKS = 1;`
    let register3 = function(userId,library){
      var sql3 = `insert ignore into user${userId} (id,degree) select id,degree from cet where level like '%${library}%'`;
      return sql3;
    }
    //修改个人资料
    let submitMsg = function(msg){
      let sql = `UPDATE message
      SET name='${msg.name}',sex='${msg.sex}',age='${msg.age}',hometown='${msg.hometown}',hobby='${msg.hobby}' where userId = '${msg.username}'`
      return sql;
    }
    //修改用户词库
    let setLibrary = function(username,libraryAll,library){
      var sql = {sql1:'',sql2:''};
      sql.sql1 = `UPDATE message
      SET wordlibrary='${libraryAll}' where userId = '${username}'`
      sql.sql2 = `insert ignore into ${username} (id,degree) select id,degree from cet where level like '%${library}%'`;
      return sql;
    }
    //获取用户词库
    let getLibrary = function(username){
      let sql = `SELECT wordlibrary FROM message where userId = '${username}'`
      return sql;
    }
    //获取cet4单词库
    let cet4 = function(username,library,sortMethod,findWord,filtMethod){
      //SELECT cet.english,cet.chinese,cet.sent,${username}.degree FROM cet INNER JOIN ${username} ON (cet.id = ${username}.id and cet.level like '%${library}%');
      //var sql = `SELECT * FROM cet where level like "%${library}%"`;
      var sql = `SELECT cet.id,cet.english,cet.chinese,cet.sent,${username}.degree FROM cet INNER JOIN ${username} ON cet.id = ${username}.id where cet.level like '%${library}%'`;

      switch(filtMethod){
        case 'nostudy': sql+=` and ${username}.degree = 0`;break;
        case 'seem': sql+=` and ${username}.degree >= 1 and ${username}.degree <= 5`;break;
      }
      if(findWord != ''){
        sql+= ` and cet.english like '${findWord+'%'}'`
      }
      switch(sortMethod){
        case 'degree': sql+=` ORDER BY ${username}.degree desc`;break;
        case 'degreeagain': sql+=` ORDER BY ${username}.degree ASC`;break;
        case 'initialagain': sql+=' ORDER BY CONVERT(cet.english USING GBK) ASC';break;
        case 'initial': sql+=' ORDER BY CONVERT(cet.english USING GBK) desc';break;
      }
      return sql;
    }
    //获取cet6单词库
    let cet6 = function(){
      let sql = `SELECT * FROM cet where level = 6`;
      return sql;
    }
    //更新cet词库熟练度
    let updateCet = function(username,engOrId,degree){
      var sql;
      if(typeof(engOrId)=='number'){
        sql = `UPDATE ${username} SET degree = degree + '${degree}' WHERE id = '${engOrId}';`
      }else{
        sql = `UPDATE ${username} SET degree = degree + '${degree}' WHERE id = (select id from cet where english = '${engOrId}');`
      }
      return sql;
    }
    //更新背单词计划
    let setPlan = function(username,plan){
      let sql = `update message set plan = ${plan} where userId = '${username}'`;
      return sql;
    }
    //收藏作品
    let collect = function(username,colType,name,englishName,url,imgUrl){
      var obj = {name:name,englishName:englishName,url:url,imgUrl:imgUrl};
      obj = JSON.stringify(obj);
      let sql = `update message set ${colType} = concat('${obj},',${colType}) where userId = '${username}'`;
      return sql;
    }
    //获取收藏
    let getCollect = function(username){
      let sql = `select works from message where userId = '${username}'`;
      return sql;
    }
    //获取文章内容
    let getMessage = function(item){
      var reg1 = /economist(.*)/;
      var reg2 = /poetry(.*)/;
      let sql = '';
      if(reg1.test(item)){
        sql = `SELECT * FROM tb_message where name = '${item}'`;
      }else if(reg2.test(item)){
        
        sql = `SELECT * FROM tb_poetry where name = '${item}'`;
      }
      
      return sql;
    }
    //获取杂志内容
    let getMagazine = function(){
      let sql = `SELECT * FROM tb_message`;
      return sql;
    }
    //获取个人资料
    let getPerson = function(username){
      let sql = `SELECT * FROM message where userId= '${username}'`;
      return sql;
    }
    //获取随机单词
    let getWords = function(num){
      let sql = `select * from cet where id order by rand() limit ${num};`
      return sql;
    }
    //获取诗歌内容
    let getPoetry = function(){
      let sql = `SELECT * FROM tb_poetry`;
      return sql;
    }
    //获取诗歌详情展示
    let getDetails = function(name){
      let sql = `SELECT name,Title,author,classify,subsection,total,intro FROM tb_poetry where name = '${name}'`;
      return sql;
    }
    //获取熟练度进度
    let getDegree = function(username,library){
      //let sql = `SELECT SUM(degree) as sum,count(id) as count FROM cet`;
      let sql = `SELECT count(cet.id) as count,SUM(${username}.degree) as sum FROM cet INNER JOIN ${username} ON cet.id = ${username}.id`;
       //where cet.level like '%cet4%' or cet.level like '%cet6%'`
       if(library.length){
         sql += ` where cet.level like '%${library[0]}%'`
       }
       if(library.length>1){
         library.forEach((e,index)=>{
           if(index)
          sql+= ` or cet.level like '%${e}%'`
         })
       }
      return sql;
    }
    //获取在学单词id
    let highlight = function(username,name){
      let sql = `SELECT cet.id,cet.english,cet.chinese,cet.sent,${username}.degree FROM cet INNER JOIN ${username} ON cet.id = ${username}.id where english IN (SELECT english FROM ${name})`
      //let sql = `SELECT * FROM cet WHERE id IN (SELECT id from ${username}) and english IN (SELECT english FROM ${name})`;
      return sql;
    }
    //翻译单词
    let transWord = function(isImport,word){
      if(isImport){
        var sql = `select * from cet where english = '${word}'`
      }else{
        var sql = `select * from words where Word = '${word}' or GQS = '${word}' or GQFC = '${word}' or XZFC = '${word}' or FS = '${word}'`;
      }
      
      return sql;
    }
    //获取视频字幕及翻译
    let getMovie = function(movie){
      var tb_movie = 'tb_'+ movie;
      let sql = `SELECT * FROM ${tb_movie}`;
      return sql;
    }
 module.exports={
    Query,

    login,
    register,
    register2,
    register3,
    cet4,
    updateCet,
    cet6,
    getMessage,
    transWord,
    highlight,
    getMovie,
    getPoetry,
    getMagazine,
    getPerson,
    getDegree,
    getWords,
    submitMsg,
    setLibrary,
    getLibrary,
    getDetails,
    getCollect,
    setPlan,
    collect
 }