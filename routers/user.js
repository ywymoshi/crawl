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
     const token = jwt.sign(user.toJSON(), secretOrkey, { expiresIn: 604800  });
     ctx.body = { code:1, msg: '登陆成功', token: 'Bearer ' + token };
   }else {
     ctx.status = 400;
     ctx.body = { msg: '账号或密码错误!' };
   }

});

router.post("/getUserInfo", async ctx => {
  const req = ctx.query;
  const token = ctx.headers.authorization;
  if(token){
    try {
      const result = await tools.verToken(token);
      if (!req.username) {
        return ctx.body = {
          code: '-1',
          desc: '参数错误'
        }
      } else {
        let user = await user.find({ username: username, pwd: pwd });
        if (req.username == data.username) {
          return ctx.body = {
            code: '0',
            userInfo: JSON.stringify(user),
            desc: '获取用户信息成功'
          }
        }
      }
    } catch (error) {
      ctx.status = 401;
      return ctx.body = {
        code: '-1',
        desc: '登陆过期，请重新登陆'
      }
    }
  }else{
    ctx.status = 401;
    return ctx.body = {
      code: '-1',
      desc: '登陆过期，请重新登陆'
    }
  }

})
module.exports = router;
