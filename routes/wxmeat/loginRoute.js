/*
 * @Author: Zhongqi.ZHANG
 * @Date: 2021-01-18 10:38:33
 * @LastEditTime: 2021-02-05 15:30:40
 * @LastEditors: SoPudge
 * @Description: 微信小程序登录routers
 * @FilePath: /ocs-server/routes/wxmeat/loginRoute.js
 */


const express = require('express')
const Logger = require('../../utils/Logger')
const wxMeatLoginController = require('../../controllers/wxmeat/loginController')
const router = express.Router()

//声明日志文件
let logger = Logger()

/* GET users listing. */
router.post('/v1/login', wxMeatLoginController.postLogin)

module.exports = router;