/*
 * @Author: ZHANG Zhongqi
 * @Date: 2021-01-21 15:15:50
 * @LastEditTime: 2021-01-21 16:04:15
 * @LastEditors: Please set LastEditors
 * @Description: 时间转换公共方法
 * @FilePath: /ocs/ocs-server/utils/FormDate.js
 */

//format: 2021-01-21T07:17:45.748Z
let date = new Date();
let year = date.getFullYear().toString()
let month = (date.getMonth() + 1).toString()
let day = date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate().toString()

//format: 20210219
let ymd = year + month + day

//format: 2021-02-19
let y_m_d = year + '-' + month + '-' + day

//function: ymd或y_m_d时间到timestamp
exports.convertToTimeStamp = function (dateform) {
    if (dateform.includes('-')) {
        let ymd = dateform
    } else {
        // let ymd = dateform.split('-').join('')
        let y = dateform.substring(0, 4) + '-'
        let m = dateform.substring(4, 6) + '-'
        let d = dateform.substring(6, 8)
        let ymd = y + m + d
    }
    //转换yyyymmdd到时间戳
    let date = new Date(ymd)
    let ymd_stamp = date.getTime()
    return ymd_stamp
}

