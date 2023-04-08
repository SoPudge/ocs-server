/*
 * @Description: 全局中间件，所有接口都会用到的中间件，即对req的处理逻辑和顺序，详见代码末income/outcome逻辑
 * @Version: 1.0
 * @Autor: SoPudge
 * @Date: 2021-01-30 22:53:38
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-15 17:50:36
 */


const CustomError = require('../utils/CustomError')
const FiltersService = require('../services/common/FiltersService')
// const bodyParser = require('body-parser')
const { to, te } = require('../utils/AwaitTo')
const Logger = require('../utils/Logger')
const logger = Logger()

/**
 * @description: 全局日志记录中间件，向单实例log4js添加sid跟踪字段，sid为当前毫秒时间戳，同时向所有res的header当中预先添加requestId字段，方便跟踪，应位于所有app.use最前面
 */
let loggerSid = async function (req, res, next) {
    let sid = new Date().getTime()
    logger.addContext('sid', sid)
    res.append('requestId', sid)
    next()
}
// module.exports = loggerSid

/**
 * @description: 全局访问日志独立记录，记录所有访问服务器的请求记录，应位于请求相关的app.use前面，在日志记录后面
 */
let accessLog = async function (req, res, next) {
    if (req.method === 'GET') {
        logger.info(`START HTTP GET to API ${req.path} - From appId ${req.header('appId')} - Source: ${req.ip} - SessionId: ${req.header('sessionId')} - Requests: ${JSON.stringify(req.query)}`)
    } else {
        logger.info(`START HTTP POST to API ${req.path} - From appId ${req.header('appId')} - Source: ${req.ip} - SessionId: ${req.header('sessionId')} - Requests: ${JSON.stringify(req.body)}`)
        // console.log(typeof(req.body))
        // console.log(JSON.parse(req.body))
        // console.log(req.query)
        // console.log(req.params)
    }
    next()
}

/**
 * @description: 全局错误记录中间件，记录所有抛出的error，并根据error的自定义类别决定是否返回respond，一般非内部错误返回client信息，内部错误直接抛出500，此路由不再next()
 */
let logError = async function (err, req, res, next) {
    logger.error(err)
    // console.log(err.name)
    // console.log(err instanceof CustomError.ClientError)
    // console.log(err instanceof CustomError.ServerError)
    if (err instanceof CustomError.ClientError) {
        res.status(err.statusCode).json({ error_code: err.error_code, request_id: res.get('requestId'), message: err.statusMsg })
    } else {
        //处理系统错误统一抛出400 BAD REQUEST，todo更好的处理方案
        let srverr = new CustomError.ServerError()
        res.status(srverr.statusCode).json({ error_code: srverr.error_code, request_id: res.get('requestId'), message: srverr.statusMsg })
    }
}

/**
 * @description: 计算每个请求所花费时间，应放在添加sid中间件之后，所有中间件之前
 */
let respondTime = async function (req, res, next) {
    req._startTime = new Date() // 获取时间 t1
    let calResponseTime = function () {
        let now = new Date(); //获取时间 t2
        let deltaTime = now - req._startTime;
        logger.info(`FINISH request ${res.get('requestId')}, all time is ${deltaTime}ms`)
    }
    res.once('finish', calResponseTime);
    // res.once('close', calResponseTime);
    return next();
}

/**
 * @description: 检查header是否合法，包含sessionId和appId异常的各种情况，由于包含await，必须通过te方法抛出错误
 */
let headerCheck = async function (req, res, next) {
    //headerCheck的例外，不检查login，不检查静态images请求
    let conditions = (req.path.indexOf('login') !== -1 ||
        req.path.indexOf('images') !== -1
        // req.path.indexOf('wxmeat/v1/meatlog')
    )
    if (conditions) {
        next()
    } else {
        await FiltersService.reqHeaderFilter(req.header('sessionId'), req.header('appId'))
        next()
    }
}

/**
 * @description: 所有未找到的API进入此中间件，直接抛出错误由错误处理中间件处理
 */
let apiNotFound = async function (req, res, next) {
    next(new CustomError.ApiNotFoundError())
}

/**
 * @description: 处理post请求当中请求体为json的情况，由于express需要使用中间件处理post请求体，这里统一用一个方法对post请求体当中的content-type进行区分，以用不同的中间件处理post请求体，在最外层处理post请求体，为了方便，统一使用的text形式，这里转换json
 * @return {*}
 */
let postBodyParser = async function (req, res, next) {
    logger.debug('start body parser')
    if (req.method !== 'GET') {
        logger.debug('jump to json')
        let contentType = req.get('content-type')
        if (contentType === 'application/json') {
            req.body = JSON.parse(req.body)
        }
        next()
    } else {
        // logger.debug('')
        next()
    }
}

/**
 * @description: 需要添加的公共中间件加入array即可
 */
let incomeRouter = [postBodyParser,loggerSid, respondTime, accessLog, te(headerCheck)]
let outcomeRouter = [apiNotFound, logError]

module.exports = {
    incomeRouter: function (app) {
        for (let i of incomeRouter) {
            app.use(i);
        }
    },
    outcomeRouter(app) {
        for (let i of outcomeRouter) {
            app.use(i);
        }
    }
}
