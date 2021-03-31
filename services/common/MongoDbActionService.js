/*
 * @Author: your name
 * @Date: 2021-01-25 16:14:00
 * @LastEditTime: 2021-02-17 15:28:01
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs-server/services/common/MongoDbActionService.js
 */

const CustomError = require('../../utils/CustomError')
/**
 * @description: 传入条件查询Mongodb数据库
 * @param {*} model: 要查询的模型
 * @param {*} filters: 查询条件，同mongodb官方
 * @param {*} projection: 需显示的字段，例如{_id:1}
 * @param {*} options: 显示选项，例如限制返回数量{limit:10}
 * @return {*} 注意返回的是数组
 */
let find = function (model, filters, projection, options) {
    return new Promise((resolve, reject) => {
        model.find(filters, projection, options, (err, res) => {
            if (err) {
                reject(err)
            } else {
                if (res === []) {
                    reject('Result not existed')
                } else {
                    resolve(res)
                }
            }
        })
    })
}

/**
 * @description: 传入条件查询Mongodb数据库，仅查询单条记录并返{}
 * @param {*} model: 要查询的模型
 * @param {*} filters: 查询条件，同mongodb官方
 * @param {*} projection: 需显示的字段，例如{_id:1}
 * @param {*} options: 显示选项，例如限制返回数量{limit:10}
 * @return {*} 注意返回的是对象，对象为null代表查询成功但无资源即404，在调用方法当中处理查询为空的情况
 */
let findOne = function (model, filters, projection, options) {
    return new Promise((resolve, reject) => {
        model.findOne(filters, projection, options, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }

        })
    })
}

/**
 * @description: 传入条件查询一个文档并更新其中内容
 * @param {*} model: 查询模型
 * @param {*} filters: 查询条件
 * @param {*} update: 更新条件
 * @param {*} options: 显示选项，例如限制返回数量{limit:10}
 * @return {*} 查询不到返回null，查询更新成功则返回更新成功后的document，需在调用时处理为null的情况，注意如果配置upinsert:true后，查询不到还是会返回null，但依然会创建document，注意处理返回了null但是依然创建的情况
 */
let findOneAndUpdate = function (model, filters, update, options={'new':true}) {
    return new Promise((resolve, reject) => {
        model.findOneAndUpdate(filters, update, options, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

/**
 * @description: 封装mongoose的插入方法
 * @param {*} instance: 需要插入的model的示例，含有数据
 * @return {*}
 *          返回插入的数据明细
 */
let insert = function (instance) {
    return new Promise((resolve, reject) => {
        instance.save()
            .then((res) => { resolve(res) })
            .catch((err) => { reject(err) })
    })
}

/**
 * @description: 封装mongoose的update方法
 * @param {*} model: 需要更新的模型Model
 * @param {*} query: 查询需要更新的document
 * @param {*} sets: 根据查询结果给出更新的字段{}
 * @param {*} options: 保留
 * @return {*}
 *          { n: 0, nModified: 0, ok: 1 }:查询未命中，即query无法查询到结果
 *          { n: 1, nModified: 0, ok: 1 }:查询命中，但值不变，未更新
 *          { n: 1, nModified: 1, ok: 1 }:查询命中，已经修改成功
 */
let update = function (model, query, sets, options) {
    return new Promise((resolve, reject) => {
        model.update(query, sets, options)
            .then((res) => { resolve(res) })
            .catch((err) => { reject(err) })
    })
}

module.exports = {
    find: find,
    findOne: findOne,
    findOneAndUpdate: findOneAndUpdate,
    insert: insert,
    update: update
}

//test
// let mongoose = require('../../utils/Connection')
// let PlantsModel = require('../../models/common/PlantsModel')
// let query = { 'plantName': 'WUX' }
// let sets2 = {'plantName': 'WUJ'}

// // let MongoDbActionService = require('.')
// Update(PlantsModel, query, sets2)
//     .then((res) => { console.log(res) })
//     .catch((err) => { console.log(err) })

