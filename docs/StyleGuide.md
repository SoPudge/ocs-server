# Style Guide for Office-Core-System
## 命名规范
### 1. 常规

Routes,Controllers,Models文件明采用大驼峰命名法且命名以文件类型结尾，工具类除外
>工具类：Logger.js  
>路由：LoginRoute.js  
>控制器：LoginController.js  
>模型：UsersModel.js

关键文件夹结构均以app名称区分，版本号可以通过controller和route文件共同控制，方便统一管理
>/controllers/app1/xxController
>/controllers/app2/xxController

由文件导出的对象，同文件名命名
>从文件UsersModel.js导出的对象，应该同mongo数据库collection命名，同mongoose文档的解释
>module.exports = mongoose.model('col_userlist',usersSchema)

由另外文件导入的对象，也应该和原始文件导出的Model同名方便管理
>const UsersModel = require('../../models/UsersSchema')

由模型生成的实例，应当将模型的Model单词改为Instance，且使用小驼峰命名法，名词大小写随原始模型命名
>var usersModelInstance = new UsersModel({...})

控制器文件本身的命名无需含有app的字样，因为已经由文件夹区分，并且一个API一个控制器，可以含有多个API逻辑，方便对应路由文件管理
>/controllers/report/v1/LoginController.js  
>无需叫reportLoginController.js

由控制器导出的对象，使用module.exports={key:array,key:array}形式  
`module.exports = {
    getMeatLog: [te(requestParamsCheck), te(queryMeatLog)],
    creatMeatLog: [te(requestParamsCheck), te(createMeatLog)]
}`

对于路由导入的控制器对象，按照实际情况命名，方便查看和识别
>const wxMeatLogControllers = require('../../controllers/wxmeat/meatlogController')
>router.post('/v1/meatlog',wxMeatLogControllers.creatMeatLog)

## 逻辑和流程

### 1. app入口app.js

整体程序逻辑请求都在app.js当中定义，除了express默认的请求设置之外，本app还增加了自定义的中间件，以处理特殊的请求，所有自定义的内容都在app.js当中//custom settings注释后面体现。

一般流程如下：

post请求体转换为text——公共入口中间件——正常路由处理——公共出口中间件

### 2. 公共中间件PublicMw.js

所有公共中间件都存在于middlewares/PublicMw.js文件当中，此文件定义了所有公共入口/出口中间件，对于任何API都同样生效，此文件中所有的中间件都通过module.exports方式导出，区分为incomeRouter和outcomeRouter，即入口中间件和出口中间件，可以直接查看文件导出的部分了解各个中间件的排列顺序，下面简单解释

**incomeRouter**
-   postBodyParser  :处理所有post的请求体，根据content-type转换为相应的格式，以免在app.js当中定义多个处理中间件
  
-   loggerSid       :全局日志记录中间件，给logger4js的单一实例添加sid字段，给所有进来的respond的header添加requestId字段，以上两个字段均为接受该请求的时间戳，方便跟踪

-   respondTime     :完成一个请求所消耗的时间，所有请求均需要，在请求完成后单独用日志显示

-   accessLog       :记录所有访问express的请求并写入日志

-   headerCheck     :request的header检查，所有进入express的请求必须包含sessionId和appId，否则拒绝请求。

**outcomeRouter**
-   apiNotFound     :未进入普通api处理程序的请求，由此中间件拦截，并返回未找到错误
-   logError        :所有错误均通过next()抛出至此中间件统一处理，所有抛出的错误均预先定义在utils/CustomError.js当中

### 3.通用api编写逻辑

所有对外暴露的可访问的api均定义在routes文件夹当中，此文件夹当中的路由规则调用controller当中的控制器逻辑，来完成路由的整体逻辑，同时可以在routers当中编写不同版本的路由规则，以便于后期更新。

所有路由规则的逻辑都体现在controller当中，控制器文件最后通过module.exports导出该控制器对外暴露的逻辑，此逻辑会被routes引用完成路由选择逻辑。

控制器仅包含http访问后的第一层逻辑封装，对于通用逻辑，例如查询数据库，查询和验证session，都通过sevices文件夹当中服务统一管理，方便复用。

### 4.API访问逻辑

1.  所有http访问必须在header当中包含sessionId和appId字段，登陆相关API除外，否则一律报错无权限
2.  一旦验证sessionId和appId通过，则进入正常路由流程，会由相关路由负责该请求的处理
3.  一旦路由处理过程中报错，会抛出错误到日志，同时抛出respond回复该请求是哪个错误，对于client错误，会抛出详细错误码方便查找文件，对于server服务器错误，统一抛出500错误，后续可在日志当中查询相关报错，所有的报错均含有requestId方便跟踪



