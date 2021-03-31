/*
 * @Author: your name
 * @Date: 2021-01-26 14:20:26
 * @LastEditTime: 2021-02-02 16:19:41
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/services/common/mongo.js
 */

// const MyError = require('../../utils/CustomError')
// const { all } = require("../../utils/CustomError");

// //populate
let mongoose = require('../../utils/Connection')
const SessionStorageModel = require('../../models/common/SessionStorageModel')
const AppListModel = require('../../models/common/AppListModel')
// mongoose.model('col_applists')

SessionStorageModel.find({ sessionId: 'JuXFGvPQ3lPiXQVSRpanDA==' }).populate({path:'app_id',model:AppListModel})
    // exec(function (err, res) {
    //     if (err) return handleError(err);
    //     console.log(res);
    // })
    .then((res) => { console.log(res) })
// console.log(SessionStorageModel.populated('app_id'))

//mongo cmdlet

// var url = "mongodb://192.168.0.111:27017/ftes";
// var db = connect(url);
// print('ok')

// var x = db.col_department.find()
// var y = db.temp.find()
// for (var i = 0; i < 97; i++) {
//     var departmentName = x.next().departmentName
//     var m = db.temp.find({'departmentName':departmentName})
//     var y_parent = m.next().parent
//     db.col_department.update({'departmentName':departmentName},{$set:{'parent':y_parent}})
//     print('ok2')
// }

//test error
// let test = function (a) {
//     return new Promise((resolve, reject) => {
//         if (a === 1) {
//             resolve(a)
//         } else {
//             reject('fail')
//         }
//     })
// }

// test(2)
//     .then((res)=>{console.log(res)})
//     .catch((err)=>{throw Error(err)})

// let to = function (promise) {
//     return promise
//         .then((res) => res)
//         .catch((err) => {
//             console.log('this is to function')
//             //send
//             throw new MyError()
//         })
// }

// let r = async function (a) {
// try {
//     let z = await test(2)
//         .catch((err) => { throw Error(err) })
//     // console.log(z)
// } catch (e) {
//     console.log(e)
// }

// let z = await to(test(a))
// console.log(z)
// }

// let d = async function () {
//     try {
//         let z = await to(test(2))
//         // console.log(z)
//     } catch (e) {
//         console.log(e)
//     }
// }
// d()