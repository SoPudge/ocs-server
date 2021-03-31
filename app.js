/*
 * @Author: your name
 * @Date: 2021-01-18 10:20:59
 * @LastEditTime: 2021-02-09 10:08:40
 * @LastEditors: SoPudge
 * @Description: In User Settings Edit
 * @FilePath: /ocs-server/app.js
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
// var logger = require('morgan');
var Routers = require('./routes/Routers')

var indexRouter = require('./routes/common/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('combined'));
// app.use(express.json());
// app.use(express.raw());
// app.use(express.urlencoded());
app.use(cookieParser());


// app.use(bodyParser.text({ type: 'text/html' }))
//custom settings
app.use(express.text({type:'*/*'}))
const PubMw = require('./middlewares/PublicMw')
let mongoose = require('./utils/Connection');
PubMw.incomeRouter(app)
app.use(express.static(path.join(__dirname, 'public')));
let api = require('./routes/Routers.js')
api(app);
PubMw.outcomeRouter(app)

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
