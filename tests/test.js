/*
 * @Author: SoPudge
 * @Date: 2021-02-03 11:03:15
 * @LastEditors: SoPudge
 * @LastEditTime: 2021-02-17 16:55:34
 * @Description: file content
 * @FilePath: /ocs-server/tests/test.js
 */

//批量修改字段类型
// db.col_users.find({wx_info:{wx_open_id:{$type:"Array"}}}).forEach( function (x) {
db.col_users.find({ "wx_info.wx_open_id": { $type: "array" } }).forEach(function (x) {
    x.wx_info.wx_open_id = new Object();
    db.col_users.save(x);
});

//批量添加用户权限到applist
db.col_users.find({}).forEach(function (x) {
    db.col_applists.findOneAndUpdate({ "appName": "wxMeat-local", "authorization": { [x.work_no]: true } }, {"authorization": { [x.work_no]: true }})
});

//批量删除
db.col_users.find({}).forEach(function (x) {
    db.col_applists.remove({ "authorization": { $type: "object" } })
});
