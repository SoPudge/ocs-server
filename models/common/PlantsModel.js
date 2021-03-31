/*
 * @Author: your name
 * @Date: 2021-01-26 10:08:12
 * @LastEditTime: 2021-01-26 11:18:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ocs/ocs-server/models/common/PlantsModel.js
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantsSchema = new Schema({
    plantName : {type: String},
    description: { type: String },
    generalManager: { type: Schema.ObjectId, ref: 'col_users'},
    deputyGeneralManager: { type: Schema.ObjectId, ref: 'col_users'},
}, { versionKey: false });
module.exports = mongoose.model('col_plants', PlantsSchema)
