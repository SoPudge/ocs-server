/*
 * @Author: your name
 * @Date: 2021-01-26 16:19:30
 * @LastEditTime: 2021-01-31 22:38:31
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/services/common/WxLoginService.js
 */

const path = require('path')
const Logger = require('../../utils/Logger')
const axios = require('axios')
const CustomError = require('../../utils/CustomError')

//声明日志文件
let logger = Logger()

/**
 * @description: 传入微信小程序的id/secret和wx.Login小程序端生成的reqcode后获取openId
 * @param {*} appId: 微信小程序appId
 * @param {*} appSecret: 微信小程序appSecret
 * @param {*} reqcode: 微信小程序wx.Login生成的code
 * @return {*} 返回微信errcode对象/openid对象/或者请求错误
 */
let getWxOpenId = function (appId, appSecret, reqcode) {
    let wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${reqcode}&grant_type=authorization_code`
    return new Promise(function (resolve, reject) {
        axios.get(wxUrl)
            .then((res) => {
                if (res.data.hasOwnProperty('errcode')) {
                    reject(new CustomError.WxAuthServerError(JSON.stringify(res.data)))
                } else {
                    resolve(res.data)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

exports.getWxOpenId = getWxOpenId


//test
// let appId = 'wx1e63747bc1b9ba78'
// let appSecret = '3f5514677b06bfce576673dca09507ba'
// let reqcode = '033RKx1w3GXLLV2Nvs3w3Mhks81RKx1n'
// getWxOpenId(appId, appSecret, reqcode)
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((err)=>{console.log(err)})