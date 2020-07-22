
# 学习资料

    说明
     ```
        仅供参考和学习，如果侵权，请联系作者删除（1570555124@qq.com）
     ```
    环境
    ```
       mongodb、node 
    ```
    
    数据库相关  
    ```
    修改数据库 /db/db.js 连接
    打开命令行工具执行以下脚本,导入mongodb 数据
       cd crawl
       mongoimport -d test -c courselessons  --type json --file './db/data/courselessons.json'
       mongoimport -d test -c lessons  --type json --file './db/data/lessons.json'
       mongoimport -d test -c courses  --type json --file './db/data/courses.json'
       users表,用于登录，在课程列表中会显示更新按钮，不登录是没有的，自己将user.json的数据改一下。
       mongoimport -d test -c users  --type json --file './db/data/users.json'
    ```
    
    执行
    ```
    npm install 
    node index.js
    ```
