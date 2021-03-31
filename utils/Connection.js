/*
 * @Author: your name
 * @Date: 2021-01-20 01:42:18
 * @LastEditTime: 2021-02-17 14:53:53
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/utils/Connection.js
 */

// Set up mongoose connection
const Logger = require('../utils/Logger')
const mongoose = require('mongoose')

//声明日志文件
let logger = Logger('access')

const dev_db_url = 'mongodb://root:74107409@127.0.0.1:27017/ftes?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'

mongoose.connect(dev_db_url, {
    user: "root",
    pass: "74107410",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}, function (error) {
    if (error) {
        logger.error('MongoDb connection failed')
        logger.error(error)
    } else {
        logger.info('MongoDb connection successed')
    }
})

module.exports = mongoose