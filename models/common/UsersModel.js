/*
 * @Author: your name
 * @Date: 2021-01-18 20:12:38
 * @LastEditTime: 2021-01-28 10:41:23
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/models/common/UsersModel.js
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* 
*/
//wx_open_id应为类似object:[id,id,id]
var UsersSchema = new Schema({
    work_no: { type: String, required: false },
    access_no: { type: String, required: false },
    cn_name: { type: String },
    wx_info: { wx_open_id: Array, wx_union_id: String, wx_avatar: String },
    it_info: { ad_account: String, employee_id: String, email: String, display_name: String },
    mobile: { type: String },
    department: { type: Schema.ObjectId, ref: 'col_department' },
    password:{type:String},
    // manager: { type: Schema.ObjectId, ref: 'col_users' },
    // plant: { type: String },
    enable: { type: Boolean }
}, { versionKey: false });
module.exports = mongoose.model('col_users', UsersSchema)

// test
// let MongoDbActionService = require('../../services/common/MongoDbActionService')
// let mongooseConnection = require('../../utils/Connection')
// let UsersModel = require('./UsersModel')
// // MongoDbActionService.Insert(ins)
// //     .then((res) => { console.log(res) })
// //     .catch((err) => { console.log(err) })
// // add applist
// let query = {work_no:'D0002'}
// let sets2 = {$addToSet:{'wx_info.wx_open_id':{'wxMeat-local':'oDqVP6G9j0KCNon-jp69UPEKgiHs'}}}
// MongoDbActionService.Update(UsersModel, query, sets2)
//     .then((res) => { console.log(res) })
//     .catch((err) => { console.log(err) })
