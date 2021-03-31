/*
 * @Description: 
 * @Version: 1.0
 * @Autor: SoPudge
 * @Date: 2021-01-28 22:19:18
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-17 10:55:21
 */

//----------------分类开始----------------//
//一级分类，ServerError为应用错误，ClientError为抛给客户端错误，ExternalError为请求第三方返回错误
class ServerError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        this.error_code = 9000
        this.statusCode = 400
        this.message = message || 'UNDEFINED CUSTOM SERVER ERROR'
        this.statusMsg = 'bad request'
    }
}

class ClientError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name
        this.error_code = 9100
        this.message = 'UNDEFINED CUSTOM CLIENT ERROR'
        this.statusCode = 999
        this.statusMsg = 'undefined custom client error'
    }
}

class ExternalError extends ServerError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name
        this.error_code = 9200
        this.message = message || 'DEFAULT EXTERNAL SERVER ERROR'
        this.statusCode = 500
        this.statusMsg = 'INTERNAL ERROR'
    }
}

//----------------分类结束----------------//

//tet

// let errorArray = []

class UserNotFoundError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9101
        this.message = message || 'USER NOT FOUND'
        this.statusCode = 404
        this.statusMsg = 'user not found'
    }
}

//用户存在，但无权限访问此应用/页面等
class PermissionDenyError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9102
        this.message = message || 'PERMISSION DENIED'
        this.statusCode = 404
        this.statusMsg = 'permission denied'
    }
}

class AppNotFoundError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9103
        this.message = message || 'APPLICATION NOT FOUND'
        this.statusCode = 404
        this.statusMsg = 'application not found'
    }
}

class ParamsKeyNotMatchError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9104
        this.message = message || 'REQUEST PARAMS KEY CHECK FAILED'
        this.statusCode = 404
        this.statusMsg = 'get/post requst params key check failed'
    }
}

//登录检查，sessionId没有包含在request header当中，提示登陆
class SessionNotRequestError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9105
        this.message = message || 'SESSIONID NOT FOUND IN REQUEST HEADER'
        this.statusCode = 404
        this.statusMsg = 'sessionId not found in request header'
    }
}

//sessionId已经提交，但未在后台数据库查询到，极少出现
class SessionNotFoundtError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9106
        this.message = message || 'SESSION NOT FOUND IN SESSION LIST'
        this.statusCode = 404
        this.statusMsg = 'sessionId not found in session list'
    }
}

//sessionId已过期，提示重新登陆
class SessionTimeOutError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9107
        this.message = message || 'SESSION TIMEOUT'
        this.statusCode = 404
        this.statusMsg = 'sessionId timeout, please login'
    }
}

//appId在header当中未附加错误
class AppidNotRequestError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9108
        this.message = message || 'APPID NOT FOUND IN REQUEST HEADER'
        this.statusCode = 404
        this.statusMsg = 'appid field not found in request header'
    }
}

//appid在数据库当中未找到
class AppidNotFoundtError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9109
        this.message = message || 'APPID NOT FOUND IN APP LIST'
        this.statusCode = 404
        this.statusMsg = 'appid not found in app list'
    }
}

//请求api错误未找到
class ApiNotFoundError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9110
        this.message = message || 'REQUEST API NOT FOUND'
        this.statusCode = 404
        this.statusMsg = 'request api not found'
    }
}

//请求的工号不存在
class WorkNumNotFoundError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9111
        this.message = message || 'REQUEST WORK NUMBER NOT FOUND'
        this.statusCode = 404
        this.statusMsg = 'request work_no not found'
    }
}

//请求的中文名不存在
class CnNameNotFoundError extends ClientError {
    constructor(message) {
        super(message);
        this.error_code = 9112
        this.message = message || 'REQUEST CN NAME NOT FOUND'
        this.statusCode = 404
        this.statusMsg = 'request cn_name not found'
    }
}

//访问微信服务器获取openid失败
class WxAuthServerError extends ExternalError {
    constructor(message) {
        super(message);
        this.error_code = 9201
        this.message = message || 'WX SERVER ERROR'
        this.statusCode = 500
        this.statusMsg = 'request openid failed'
    }
}

module.exports = {
    ServerError             : ServerError,
    ClientError             : ClientError,
    UserNotFoundError       : UserNotFoundError,
    PermissionDenyError     : PermissionDenyError,
    AppNotFoundError        : AppNotFoundError,
    ParamsKeyNotMatchError  : ParamsKeyNotMatchError,
    WxAuthServerError       : WxAuthServerError,
    SessionNotRequestError  : SessionNotRequestError,
    SessionNotFoundtError   : SessionNotFoundtError,
    SessionTimeOutError     : SessionTimeOutError,
    ApiNotFoundError        : ApiNotFoundError,
    AppidNotRequestError    : AppidNotRequestError,
    AppidNotFoundtError     : AppidNotFoundtError,
    WorkNumNotFoundError    :WorkNumNotFoundError,
    CnNameNotFoundError     :CnNameNotFoundError
}

// //test
// let x = function () {
//     throw new UserNotFoundError()
// }

// try {
//     x()
// } catch (e) {
//     console.log(e instanceof ClientError)
// }
// //HTTP ERROR


// let f1 = function () {
//     throw new DbError('test error')
// }

// try {
//     f1()
// } catch (err) {
//     console.log(err.name)
//     console.log(err.code)
//     console.log(err.message)
//     console.log(err.stack)
// }

