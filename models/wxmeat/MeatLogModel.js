/*
 * @Author: your name
 * @Date: 2021-01-21 10:01:39
 * @LastEditTime: 2021-02-05 15:37:13
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs-server/models/wxmeat/MeatLogModel.js
 */

const { TooManyRequests } = require('http-errors');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @description: wx报餐小程序二维码扫描日志
 * @param {*}: meattype：中餐晚餐。temporary：是否临时就餐
 * @return {*}
 */
var wxmeatlogSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'col_users', required: true },
    meattype: { type: String },
    timestamp: { type: Number, required: true },
    deviceid: { type: String, required:true },
    temporary:{type:Boolean,required:true}
}, { versionKey: false });

module.exports = mongoose.model('col_wxmeat_meatlog', wxmeatlogSchema)