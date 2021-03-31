/*
 * @Description: 路由声明目录
 * @Version: 1.0
 * @Autor: SoPudge
 * @Date: 2021-01-28 21:11:55
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-03-31 01:32:26
 */

//应用路由文件夹，将每个root加入到下列list当中即可

let ROUTE_PATHS = [
    //commcon_router
    ['common', ''],
    ['common','/404.js'],
    //wxmeat router list
    ['wxmeat', '/loginRoute.js'],
    ['wxmeat','/meatlogRoute.js'],
    //kindlepusher router list
    ['kindlepusher','/rssRoute.js']
];

module.exports = function (app) {
    for (let i of ROUTE_PATHS) {
        app.use('/' + i[0], require('./' + i[0] + i[1]));
    }
};