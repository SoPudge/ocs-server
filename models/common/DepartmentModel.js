/*
 * @Author: your name
 * @Date: 2021-01-26 10:03:30
 * @LastEditTime: 2021-01-27 16:05:53
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/models/common/DepartmentModel.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    departmentName : {type: String},
    description: { type: String },
    parent: { type: Schema.ObjectId, ref: 'col_department'},
    manager: { type: Schema.ObjectId, ref: 'col_users'},
    plant: { type: Schema.ObjectId, ref: 'col_plants'},
}, { versionKey: false });
module.exports = mongoose.model('col_department', DepartmentSchema)
