/*
 * @Author: your name
 * @Date: 2021-01-25 11:39:18
 * @LastEditTime: 2021-01-28 08:46:16
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/models/common/AppListModel.js
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AppListSchema = new Schema({
    appName : {type: String},
    description: { type: String },
    parentApp: { type: Schema.ObjectId, ref: 'col_applist', required: true },
    appId: { type: String, required: true },
    appKey: { type: String, required: true },
    authorization: { type: Array ,required:true},
    // authType:{type: String, enum:['internal','password']},
    // authField: {type: String,default:'work_no',required:true}
}, { versionKey: false });
module.exports = mongoose.model('col_applist', AppListSchema)

// test
// let mongoose = require('../../utils/Connection')
// let MongoDbActionService = require('../../services/common/MongoDbActionService')
// const AppListModel = require('./AppListModel')

// let ins = new AppListModel({
//     appName:'wxMeat-local',
//     description:'本地测试版本用餐小程序，上线后需更新id和key',
//     parentApp: '60111ebfeb395dd150763766',
//     appId: 'wx1e63747bc1b9ba78',
//     appKey: '3f5514677b06bfce576673dca09507ba'
// })
//
// let MongoDbActionService = require('../../services/common/MongoDbActionService')
// let mongooseConnection = require('../../utils/Connection')
// MongoDbActionService.Insert(ins)
//     .then((res) => { console.log(res) })
//     .catch((err) => { console.log(err) })
//add applist
// let query = {_id:'601120c8fb2af4d5d1323839'}
// let sets2 = {$addToSet:{authorization:{'999600f85683039f06a4c012b500000':true}}}
// MongoDbActionService.Update(AppListModel, query, sets2)
//     .then((res) => { console.log(res) })
//     .catch((err) => { console.log(err) })