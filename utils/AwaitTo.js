/*
 * @Author: SoPudge
 * @Date: 2021-01-27 13:58:42
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-01-31 20:20:15
 * @Description: 自动添加await错误处理的wrapper
 * @FilePath: /ocs/ocs-server/utils/AwaitTo.js
 */

const { NotExtended } = require("http-errors")

/**
 * @description: 用法: let [err,res] = await to(bar())
 * @param {*} promise
 * @return {*}
 */
// const to = function (promise) {
//     return promise
//         .then(data => [null, data])
//         .catch(err => [err, null])
// }

const to = function (promise, next) {
    return promise
        .then(data => data)
        .catch(err => {
            throw err
        })
}

// const to = fn => (req, res, next) => {
//     return Promise
//         .resolve(fn(req, res, next))
//         .catch(next);
// }

const te = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
}


// module.exports = to
// module.exports = te
module.exports = {
    to: to,
    te: te
}


// module.exports = to

//test
// let test = function (a) {
//     return new Promise((resolve, reject) => {
//         if (a === 1) {
//             resolve(true)
//         } else {
//             reject(false)
//         }
//     })
// }

// test(2).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)})

// let run = async function () {
//     let r = await test(2)
// }
// run()
//     .catch((err) => { console.log(err) })
