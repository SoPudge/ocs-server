/*
 * @Author: your name
 * @Date: 2021-01-20 01:42:18
 * @LastEditTime: 2021-02-17 14:53:53
 * @LastEditors: SoPudge
 * @Description: 先读取ConnectionConfig当中配置文件确定调用哪些数据库方法，再直接通过循环调用对应方法连接数据库
 * @FilePath: /ocs/ocs-server/utils/Connection.js
 */

// Set up mongoose connection
const Logger = require("../utils/Logger");
const mongoose = require("mongoose");
const db_config_path = "../config/ConnectionConfig.json";

//声明日志文件
let logger = Logger("access");


//MongoDB连接方法
const dev_db_url =
  "mongodb://root:74107409@127.0.0.1:27017/ftes?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false";

mongoose.connect(
  dev_db_url,
  {
    user: "root",
    pass: "74107410",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  function (error) {
    if (error) {
      logger.error("MongoDb connection failed, " + error);
    } else {
      logger.info("MongoDb connection successed");
    }
  }
);

//Sqlite3连接方法


//通过ConnectionConfig.json确认调用相关链接和是否连接
for (let i in db_config_path) {
    //如果db_config_path[i]['status']为0表示可用，1表示不可用
    if (db_config_path[i]['status'] === '0'){ 
        console.log('todo')
        //调用对应名称方法
    }
}

module.exports = mongoose;

