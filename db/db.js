const db = require("mongoose");

// 1.连接


db.connect("mongodb://127.0.0.1:27017/test", {useNewUrlParser: true,  useUnifiedTopology: true });


const conn = db.connection;
conn.on("error", () => console.error("连接数据库失败"));
conn.once("open", async () => {
  console.log('连接成功')
})
module.exports = conn;
