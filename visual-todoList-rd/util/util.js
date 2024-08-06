//放一些公用方法的文件

//引入文件上传模块（待加···）
//引入token验证模块
const jwt = require("jsonwebtoken");
//引入加密模块（待加···）

//jsonwebtoken加密token
function encodeJwt(){
    let content ={msg:"this is info"}; // 要生成token的主题信息
    let secretOrPrivateKey="mykey" ;// 这是加密的key（密钥） 
    let token = jwt.sign(content, secretOrPrivateKey, {
                        expiresIn: 10  // 24小时过期 60*60*24,可以设置为10秒来测试JWT是否生效
                    });
    // console.log("token ：" +token );
    return token;
}
module.exports={
    encodeJwt
}