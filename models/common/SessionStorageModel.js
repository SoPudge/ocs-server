/*
 * @Author: your name
 * @Date: 2021-01-25 13:15:22
 * @LastEditTime: 2021-02-02 16:14:58
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/models/common/SessionStorageModel.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const col_applists = require('./AppListModel')

var SessionStorageSchema = new Schema({
    sessionId: {type: String,required: true},
    user_id: {type: Schema.ObjectId, ref: 'col_users', required: true},
    app_id: {type: Schema.ObjectId, ref: 'col_applists', required: true},
    expireDateStamp: {type: String, required: true}
}, { versionKey: false });
module.exports = mongoose.model('col_sessions', SessionStorageSchema)
