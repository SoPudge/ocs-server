/*
 * @Description: 检查用户是否存在，检查该用户是否拥有某个权限
 * @Version: 1.0
 * @Autor: SoPudge
 * @Date: 2021-01-25 11:18:52
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-17 11:01:52
 */

const UsersModel = require('../../models/common/UsersModel')
const AppListModel = require('../../models/common/AppListModel')
const MongoDbActionService = require('./MongoDbActionService')
const CustomError = require('../../utils/CustomError')
const Logger = require('../../utils/Logger')
let logger = Logger()

/**
 * @description: 传入一个登录过来的对象{}，仅包含col_users当中的单一字段和值方便查询用户即可
 * @param {*} loginInfoObject: {}，传入的登陆对象，包含用户表中唯一字段值即可，不指定具体的字段
 * @return {*} 返回整个用户object
 *             用户存在：err=null,res=res
 *             用户不存在：err=null,res={}
 *             报错：err=err,res=null
 */
let isUserExist = function (loginInfoObject) {
    return new Promise((resolve, reject) => {
        MongoDbActionService.findOne(UsersModel, loginInfoObject)
            .then((res) => {
                if (res === null) {
                    logger.error(`User not found by contidion in Users list ${JSON.stringify(loginInfoObject)}`)
                    reject(new CustomError.UserNotFoundError(`User not found, find condition is ${JSON.stringify(loginInfoObject)}`))
                }
                resolve(res)
            })
            .catch((err) => { reject(err) })
    })
}

/**
 * @description: 验证传入的第一个参数，是否能查询到第二个参数的结果，是否匹配
 * @param {*} work_no
 * @param {*} cn_name
 * @param {*} cn_name
 * @return {*} 返回True/False
 * @author: SoPudge
 */
// let isMatch = async function (model, queryObject, result) {
//     let r = await MongoDbActionService.findOne(model, queryObject)
//     if (r === result) {
//         //传入信息匹配
//         return true
//     } else if (r === null) {
//         //传入信息查询为空
//         return false
//     } else {
//         //传入信息查询不为空，但不匹配
//     }
// }

//传入单个用户的json信息，可以只包含_id和密码，在传入用户输入的密码，并两者验证
//密码传入进来可以是被加密过的，密码由前端加密
/**
 * @description: 传入用户信息对象，可以只包含_id和password，在传入用户登陆的password，两者验证
 * @param {*} userInstance: Object:{_id:xxx,password:xxx}
 * @param {*} loginPassword: String，用户传入的密码
 * @return {*} 根据验证结果返回true/false
 */
let isPasswordRight = function (userInstance, loginPassword) {
    return new Promise((resolve, reject) => {
        if (userInstance.password === loginPassword) {
            resolve(true)
        } else {
            reject(false)
        }
    })
}

/**
 * @description: 检查该用户_id是否具有appId的权限，即是否在AppList当中的app中字段authorization数组中，以用户word_no:true
 * @param {*} user_id: 用户的_id字段，从col_applists表当中关联用户表
 * @param {*} appId: app的Id，微信可以在前台请求到相关id
 * @return {*} 返回true/false，存在或者不存在，或者报错
 */
let isPriviledgeExist = function (work_no, appId) {
    return new Promise((resolve, reject) => {
        // MongoDbActionService.findOne(AppListModel, { 'appId': appId, 'authorization': { [work_no]: true } })
        MongoDbActionService.findOne(AppListModel, { 'appId': appId, [`authorization.${work_no}`]: true })
            .then((res) => {
                // console.log(res)
                if (res === null) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            .catch((err) => { reject(err) })
    })
}


exports.isUserExist = isUserExist
exports.isPasswordRight = isPasswordRight
exports.isPriviledgeExist = isPriviledgeExist

// //test
// let mongoose = require('../../utils/Connection')
// const { timeStamp } = require('console')
// isUserExist({ "wx_info.wx_open_id": ["oDqVP6G9j0KCNon-jp69UPEKgiHs"] })
//     .then((res) => { console.log(res) })
//     .catch(err => { console.log(err) })

// //async
// async function run() {
//     console.log('first')
//     let [err, res] = await to(isUserExist({ "work_no": 'D0002' }))
//     console.log(res)
//     console.log(err)
// }
// run()