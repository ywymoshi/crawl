const Koa = require("koa");
const hbs = require('koa-hbs')
const koaBody = require('koa-body');
const static = require('koa-static');
const cors = require('koa2-cors');
const cacheControl = require('koa-cache-control');
const koajwt = require('koa-jwt')
const app = new Koa({proxy:true});
app.use(cors());
app.use(cacheControl({
    maxAge: 5 * 24 * 60 * 60
  })
);
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if(err.status === 401){
      ctx.status = 401;
      ctx.body = {
        code: '-2000',
        desc: '登陆过期，请重新登陆'
      };
    }else{
      throw err;
    }
  })
})

app.use(koajwt({
  secret: '123456'
}).unless({
  path: [/^\/user\/login/,/^\/course/,/\//]
}))
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));

app.use(hbs.middleware({
  viewPath: __dirname + '/views', //视图根目录    
  disableCache: true//开发阶段不缓存
}));

app.use(static(__dirname + '/public'));

const routers = require('./routers/index');

routers.forEach(item =>{
  app.use(item.routes())
})

//开始监听端口，等同于//http.createServer(app.callback()).listen(3000);
app.listen(8088,()=>{
  console.error("访问:http://localhost:8088");
});
