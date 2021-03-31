/*
 * @Author: your name
 * @Date: 2021-01-25 10:55:17
 * @LastEditTime: 2021-02-17 15:40:40
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs-server/services/common/SessionService.js
 */
//通用IAM登录流程
//app发送登录用户唯一ID和appId，后台根据用户id和appid和发送时间生成一个sessionKey和过期时间，过期时间通过cookie的expires实现
//前台验证用，电脑端通过electron和nodejs获取用户名直接登录相关用户，同时提供退出功能可以让用户以其他用户名登录
//本方法实现根据appid和用户id生成sessionkey，和expires时间，并返回客户端，客户端每次请求都带上sessionkey，经过对比即可确认
//用户为登陆状态

//接受参数userId和appId和客户端发送时间
//查询数据库是否存在userId(获取ObjectId)和appID，和该用户的授权信息，如果有用户且有授权，则生成sessionKey和expire过期时间。
//如果没有用户，则返回查无此人

//此服务前提是已经注册了该用户，如果检测未注册用户则直接报错

const crypto = require('crypto')
const path = require('path')
const Logger = require('../../utils/Logger')
const SessionStorageModel = require('../../models/common/SessionStorageModel')
const MongoDbActionService = require('./MongoDbActionService')
const CustomError = require('../../utils/CustomError')
//声明工具
let logger = Logger()

/**
 * @description: 通过传入的用户信息生成SessionKey，算法为userId->查询Users的_id，appId->appKey，loginDate，三者相加通过md5单向散列
 *               对于已经过期的sessionId直接通过FindOneAndUpdate替换掉，确保一个用户一个app仅有一个sessionId
 *               进入此流程的状态，仅有可能是无session或者session过期
 * @param {*} userInstance: 用户对象，必须含有_id字段，其他字段可无
 * @param {*} appInstance: app对象，必须含有appKey字段，其他可无
 * @param {*} expireDateStamp: 客户端传入的timestamp
 * @return {*} 创建一个以sessionId并写入col_sessions表格
 */
let createSession = async function (userInstance, appInstance, expireDateStamp) {
    let sessionStr = userInstance._id + appInstance.appKey + expireDateStamp
    let sessionId = crypto.createHash('md5').update(sessionStr).digest('base64')
    //先查找user_id + app_id的session，不存在则创建，存在则在此流程中无论是否过期都更新session
    let filters = { 'user_id': userInstance._id, 'app_id': appInstance._id }
    let SessionStorageInstance = new SessionStorageModel({
        'sessionId': sessionId,
        'user_id': userInstance._id,
        'app_id': appInstance._id,
        'expireDateStamp': expireDateStamp
    })
    //通过findOne方法检查sessionId，更新或创建，总是修改，不使用findOneAndUpdate的原因是首次创建会查询不到session则返回null
    let sessionUpdateStatus = await MongoDbActionService.findOne(SessionStorageModel, filters)
    // let sessionUpdateStatus = await MongoDbActionService.findOneAndUpdate(SessionStorageModel, filters, { 'sessionId': sessionId })
    if (sessionUpdateStatus === null) {
        //如果不存在sessionId即代表注册状态，创建session条目
        let sessionResult = await MongoDbActionService.insert(SessionStorageInstance)
        logger.debug(`session item not exist, create a new one: ${sessionResult.sessionId}`)
        return sessionResult
    } else {
        //如果存在则更新sessionId条目
        let sessionResult = await MongoDbActionService.findOneAndUpdate(SessionStorageModel, filters, { 'sessionId': sessionId })
        logger.debug(`session item exist, update a new one: ${sessionResult.sessionId}`)
        return sessionResult
    }
}

/**
 * @description: 通过session查询用户信息，由于公共中间件已经验证session的合法性，所以不重复验证
 * @param {*} sessionId: String,sessionId字符串
 * @return {*} 返回{'_id':0000}
 */
let session2user = async function (sessionId) {
    let filter = { 'sessionId': sessionId }
    let userInstance = SessionStorageModel
        .findOne(filter)
        .populate({ path: 'user_id', model: 'col_users', select: ['_id', 'cn_name'] })
    return userInstance
}

module.exports = {
    createSession: createSession,
    session2user: session2user
}

//test
// let mongoose = require('../../utils/Connection')
// async function run(){
//     let res = await createSession("600f85683039f06a4c012b54", 'root', '1611734045')
//     console.log(res)
// }
// run()