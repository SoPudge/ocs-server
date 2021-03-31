/*
 * @Author: SoPudge
 * @Date: 2021-01-28 15:58:09
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-17 06:35:09
 * @Description: 检查路由request和respond是否合法
 * @FilePath: /ocs-server/services/common/FiltersService.js
 */

/**
 * @description: 检测req请求和筛选器string,是否含有该属性
 * @param {*} req: 路由请求
 * @param {*} conditions: array,需要检测的属性列表
 * @return {*}
 */
const CustomError = require('../../utils/CustomError')
const MongoDbActionService = require('./MongoDbActionService')
const SessionStorageModel = require('../../models/common/SessionStorageModel')
const AppListModel = require('../../models/common/AppListModel')

/**
 * @description: 检查请求体中key是否符合要求，一般在各个controller当中自行调用
 * @param {*} req: 路由请求对象
 * @param {*} conditions: 测试条件，一般是数组[]中含有需要检测的key
 * @return {*}
 */
let reqParamsFilter = function (req, conditions) {
    return new Promise((resolve, reject) => {
        let newConditions = []
        if (req.method === 'GET') {
            newConditions = conditions.filter((element) => {
                return req.query.hasOwnProperty(element)
            })
        } else {
            newConditions = conditions.filter((element) => {
                // return req.body.hasOwnProperty(element)
                // return JSON.parse(req.body).hasOwnProperty(element)
                //20210217post请求直接传入的body就是对象，可以直接使用
                return req.body.hasOwnProperty(element)
            })
        }
        newConditions.length === conditions.length ?
            resolve('') : reject(new CustomError.ParamsKeyNotMatchError(`contidion is [${conditions}]`))
    })
}

/**
 * @description: 检查请求的header是否符合要求，所有请求必须携带sessionId和appId，否则一律拒绝
 * @param {*} sessionId: String，sessionId字符串
 * @param {*} appId: String，appId字符串
 * @return {*}
 */
let reqHeaderFilter = async function (sessionId, appId) {
    let sessionFilters = { 'sessionId': sessionId }
    let appIdFilters = { 'appId': appId }
    //如果sessionId为空，即前台未传输报错SessionNotRequestError
    if (sessionId === undefined) {
        throw new CustomError.SessionNotRequestError()
    }
    if (appId === undefined) {
        throw new CustomError.AppidNotRequestError()
    }
    let appIdStatus = await MongoDbActionService.findOne(AppListModel, appIdFilters, { 'appId': appId })
    if (appIdStatus === null) {
        throw new CustomError.AppidNotFoundtError()
    }
    //todo需要检查appId并报错
    let sessionUpdateStatus = await MongoDbActionService.findOne(SessionStorageModel, sessionFilters, { 'sessionId': sessionId })
    if (sessionUpdateStatus === null) {
        throw new CustomError.SessionNotFoundtError(`sessionId ${sessionId} not found in session list`)
    }
    // console.log(sessionUpdateStatus)
    if (sessionUpdateStatus.expireDateStamp < new Date().getTime()) {
        throw new CustomError.SessionTimeOutError(`sessionId ${sessionId} for ${appId} expired in ${new Date(res.expireDateStamp)}`)
    }
}

// exports.reqParamsFilter = reqParamsFilter
module.exports = {
    reqParamsFilter: reqParamsFilter,
    reqHeaderFilter: reqHeaderFilter
}
