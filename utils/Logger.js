/*
 * @Author: your name
 * @Date: 2021-01-19 20:11:09
 * @LastEditTime: 2021-02-03 10:48:18
 * @LastEditors: SoPudge
 * @Description: 导出一个log4js.getLogger对象，直接在其他文件当中方便调用
 * @FilePath: /ocs-server/utils/Logger.js
 */

const log4js = require("log4js")
const loggerConfig = require('../config/LoggerConfig.json')

// const ptn = "[%d{yyyy-MM-dd hh:mm:ss}] [%p] [%X{sid}] [%f{1} %l]- %m"
log4js.configure(loggerConfig)
const Log = log4js.getLogger()
let Logger = function(){
    return Log
}

module.exports = Logger
