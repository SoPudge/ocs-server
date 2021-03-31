/*
 * @Author: your name
 * @Date: 2021-01-21 10:20:43
 * @LastEditTime: 2021-02-08 16:40:25
 * @LastEditors: SoPudge
 * @Description: 查询和写入meatlog数据库
 * @FilePath: /ocs-server/controllers/wxmeat/meatlogController.js
 */

const Logger = require('../../utils/Logger')
const { to, te } = require('../../utils/AwaitTo')
const SessionStorageModel = require('../../models/common/SessionStorageModel')
const FiltersService = require('../../services/common/FiltersService')
const MongoDbActionService = require('../../services/common/MongoDbActionService')
const MeatlogModel = require('../../models/wxmeat/MeatLogModel')
const SessionService = require('../../services/common/SessionService')

//声明工具
let logger = Logger()

/**
 * @description: meatlog接口参数检查，完成后直接下一跳路由查询信息
 * @return {*}
 */
let requestParamsCheck = async function (req, res, next) {
    let conditions = []
    if (req.method === 'GET') {
        conditions = ['date_start_timestamp', 'date_end_timestamp']
    } else {
        conditions = ['timestamp', 'deviceid','temporary']
    }
    logger.info(`API ${req.path} perform request params ${conditions} check`)
    let checkResult = await FiltersService.reqParamsFilter(req, conditions)
    logger.debug(`Login request params match: ${JSON.stringify(conditions)}`)
    next()
}

/**
 * @description: GET请求，以sessionId查询用户的用餐记录，req包含{date_start_timestamp,date_end_timestamp,count}，count参数可以不包含，默认为20条
 * @return {*} 返回数据为仅包含时间戳的数组[x,x,x,x,x,x]，每个x都是时间戳
 */
let queryMeatLog = async function (req, res, next) {
    logger.debug(`Function - Query user meatlog`)
    let date_start_timestamp = req.query.date_start_timestamp * 1
    let date_end_timestamp = req.query.date_end_timestamp * 1
    let count = { 'limit': req.query.count * 1 || 20 }
    let projection = { 'timestamp': 1, '_id': 0 }
    let userInstance = await SessionService.session2user(req.get('sessionId'))
    console.log(count)
    //通过sessionId获取用户信息，在公共API当中已经判断过所以此session必然存在
    let meatlogFilter = {
        'user_id': userInstance.user_id._id,
        'timestamp': { $gt: date_start_timestamp, $lt: date_end_timestamp },
    }
    let userMeatLog = await MongoDbActionService.find(MeatlogModel, meatlogFilter, projection, count)
    //查询到的数据格式为[{},{}...]，通过map匹配为[a,a,a,a,a]仅包含时间戳的形式
    res.status(200).json(userMeatLog.map((i) => { return i.timestamp }))
    logger.info(`user meatlog query successed length is: ${userMeatLog.length}`)
}

/**
 * @description: 接受一个POST请求，并将用餐记录请求写入数据库
 * @return {*}
 */
let createMeatLog = async function (req, res, next) {
    logger.debug('Function - createMeatLog start')
    let userInstance = await SessionService.session2user(JSON.parse(req.body).sessionId)
    // console.log(req.body.)
    // console.log(userInstance)
    //写入数据库
    meatLogInstance = new MeatlogModel({
        'user_id': userInstance.user_id._id,
        'timestamp': JSON.parse(req.body).timestamp,
        'deviceid': JSON.parse(req.body).deviceid,
        'temporary': JSON.parse(req.body).temporary
    })
    console.log(meatLogInstance)
    let write2meatlog = await MongoDbActionService.insert(meatLogInstance)
    res.status(200).json({ result: 'success' })
    // next()
}

module.exports = {
    getMeatLog: [te(requestParamsCheck), te(queryMeatLog)],
    creatMeatLog: [te(requestParamsCheck), te(createMeatLog)]
}