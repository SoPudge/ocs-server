/*
 * @Author: SoPudge
 * @Date: 2021-01-19 16:09:31
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-17 15:41:07
 * @Description: 收到登录请求后获取openid，检查用户是否存在，检查权限是否分配，创建并返回sessionId
 * @FilePath: /ocs/ocs-server/controllers/wxmeat/loginController.js
 */

const Logger = require('../../utils/Logger')
const WxLoginService = require('../../services/common/WxLoginService')
const MongoDbActionService = require('../../services/common/MongoDbActionService')
const AppListModel = require('../../models/common/AppListModel')
const ValidataionService = require('../../services/common/ValidationService')
const SessionService = require('../../services/common/SessionService')
const FiltersService = require('../../services/common/FiltersService')
const CustomError = require('../../utils/CustomError')
const { to, te } = require('../../utils/AwaitTo')
const UsersModel = require('../../models/common/UsersModel')
let logger = Logger()

/**
 * @description: wxMeat路由传入参数检查，传入参数必须符合预先规定，否则直接报错
 */
let loginRequestParamsCheck = async function (req, res, next) {
    logger.info(`Perform request params check`)
    let checkResult = await FiltersService.reqParamsFilter(req, ['appId', 'reqCode', 'timeStamp', 'work_no', 'cn_name'])
    // .catch((err)=>{throw err})
    // .catch((err) => { throw new CustomError.ParamsKeyNotMatchError(err) })
    logger.debug(`Login request params match: ${JSON.stringify(req.body)}`)
    next()
}

/**
 * @description: login流程中获取openid后验证无用户拥有此openid时，再通过此流程验证req当中的work_no和name是否一致并存在，若存在则进入此流程进行注册写入openid和权限到用户信息，若不存在则直接报错用户信息不一致
 * @param {*} openid: 此用户的openid
 * @param {*} work_no: 此用户工号
 * @param {*} cn_name: 用户中文姓名
 * @return {*} 
 * @author: SoPudge
 */
let register = async function (openid, appInstance, work_no, cn_name) {
    //openid不存在时，验证工号和姓名是否存在并对应
    logger.info(`Perform register check, if not go register, if yes go login`)
    let filters = { 'work_no': work_no, 'cn_name': cn_name }
    //对于col_users当中的openid，如果存在则直接更新，不存在则创建，不使用setOnInsert操作符
    let update = { [`wx_info.wx_open_id.${appInstance.appName}`]: openid }
    let r = await MongoDbActionService.findOneAndUpdate(UsersModel, filters, update)
    if (r !== null) {
        logger.debug(`Update col_users wx_info.wx_open_id object: ${r.wx_info.wx_open_id}`)
        //传入信息匹配，直接写入openid到用户信息，写入权限到applist
        let filters = { '_id': appInstance._id }
        //对于权限使用setOnInsert操作符，不存在则创建并给权限，已经存在权限不做修改
        let update = { '$setOnInsert': { [`authorization.${work_no}`]: true } }
        let res = await MongoDbActionService.findOneAndUpdate(AppListModel, filters, update)
        logger.debug(`Update col_applist authorization object: ${res.authorization}`)
        return r
    } else {
        //传入信息查询为空，抛出错误工号错误
        throw new CustomError.UserNotFoundError()
    }
}

/**
 * @description: wxMeat登陆sessionId获取，通过appId获取数据库中appSecret，再获取openid，再通过openid获取用户信息，再通过用户信息查询用户权限，任意流程出错即返回ClientError，通过后发放sessionId
 */
let login = async function (req, res, next) {
    logger.info(`Perform user access and app access check`)
    //通过appId获取appKey(即微信端的appSecret)
    let appInstance = await MongoDbActionService.findOne(AppListModel, { 'appId': req.body.appId })
    let appSecret = appInstance.appKey
    logger.debug(`query appKey ok: ${JSON.stringify(appInstance.appKey)}`)
    //通过appId和appSecret获取openid
    let openidObject = await WxLoginService.getWxOpenId(req.body.appId, appSecret, req.body.reqCode)
    logger.debug(`query openid exist: ${JSON.stringify(openidObject)}`)
    //检查是否注册，如果注册成功导出UserIntance，如果已存在用户直接返回userInstance
    let userInstance = await register(openidObject.openid, appInstance, req.body.work_no, req.body.cn_name)
    //
    //验证权限是否存在
    let isPriviledgeExist = await ValidataionService.isPriviledgeExist(userInstance.work_no, req.body.appId)
    if (!isPriviledgeExist) {
        throw new CustomError.PermissionDenyError(`permission deny for user - ${userInstance.work_no} to this app - ${appInstance.appName}`)
    }
    logger.debug(`Find app priviledge result is ${isPriviledgeExist}`)
    //发放用户sessionId，有效期为2周，在当前时间戳加2周数字，无论传输时间戳是字符串还是数字都强行转换数字*1
    expireDateStamp = req.body.timeStamp * 1 + 1209600000
    let sessionInstance = await SessionService.createSession(userInstance, appInstance, expireDateStamp)
    //创建需要返回的respond
    // console.log(sessionInstance)
    respondJson = { 'requestId': res.get('requestId'), 'sessionId': sessionInstance.sessionId }
    res.append('sessionId', sessionInstance.sessionId).status(200).type('application/json').json(respondJson)
    logger.info(`sessionId creat and save and respond successful: ${JSON.stringify(respondJson)}`)
    // next()
}

module.exports = {
    postLogin: [te(loginRequestParamsCheck), te(login)]
}