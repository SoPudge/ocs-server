/*
 * @Author: SoPudge
 * @Date: 2021-02-02 11:04:55
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-02 11:11:32
 * @Description: file content
 * @FilePath: /ocs/ocs-server/routes/common/404.js
 */

const express = require('express')
const Logger = require('../../utils/Logger')
const router = express.Router()

//声明日志文件
let logger = Logger()

//define 404 respond
let notfound = async function(req,res,next){
    res.status(404).json({'requestId':res.get('requestId'),'message':'api not found'})
}
/* GET users listing. */
router.post('/404',notfound)

module.exports = router;
