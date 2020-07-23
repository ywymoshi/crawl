const Router = require('koa-router');
const router = new Router({prefix: '/user'});
const users = require('../model/user');
const axios = require('../util/axios');
const tools = require('../util/tokenTool');
const { secretOrkey } = require('../util/config');
const jwt = require('jsonwebtoken');
router.post("/login", async ctx => {
    const { username, pwd } = ctx.request.body;
   const [user] = await users.find({ username: username, pwd: pwd });
   if(user) {
    console.log(user)
     const token = jwt.sign(user.toJSON(), secretOrkey, { expiresIn: 604800  });
     ctx.body = { code:0, msg: '登陆成功', token: 'Bearer ' + token };
   }else {
     ctx.body = { code:-1, msg: '账号或密码错误!', data: null };
   }
});

router.get("/getUserInfo", async ctx => {
  const req = ctx.query;
  const token = ctx.headers.authorization;
  if(token){
    try {
      const result = await tools.verToken(token,secretOrkey);
      result && delete result.pwd;
      return ctx.body = {
        code: 0,
        data: result,
        msg: '获取用户信息成功'
      }
    } catch (error) {
      return ctx.body = {
        code: -1,
        data:null,
        msg: '登陆过期，请重新登陆'
      }
    }
  }else{
    return ctx.body = {
      code: -1,
      data:null,
      msg: '登陆过期，请重新登陆'
    }
  }

})
module.exports = router;
