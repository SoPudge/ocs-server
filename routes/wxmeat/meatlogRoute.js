/*
 * @Author: your name
 * @Date: 2021-01-21 10:09:50
 * @LastEditTime: 2021-02-08 13:54:33
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs-server/routes/wxmeat/meatlogRoute.js
 */
const express = require('express')
const path = require('path')
const Logger = require('../../utils/Logger')
const wxMeatLogControllers = require('../../controllers/wxmeat/meatlogController')
const router = express.Router()

//声明日志文件
let logger = Logger()

/* GET users listing. */
// router.get('/', wxMeatLogControllers.getMeatLog)
router.post('/v1/meatlog',wxMeatLogControllers.creatMeatLog)
router.get('/v1/meatlog',wxMeatLogControllers.getMeatLog)

// router.get('/v1/',wxMeatLogControllers.getMeatLog)

module.exports = router;