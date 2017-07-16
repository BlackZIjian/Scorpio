var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var device = require('./routes/device');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');

global.dbHandel = require('./database/dbHandle');
global.db = mongoose.connect("mongodb://106.14.196.96:27017/Scorpio");
global.ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var clientState = require('./HeartBeat/heartBeat').clientState;
var config = require('./Config/config');
setInterval(function () {
  for(var key in clientState) {
    var deviceId = key;
    if(clientState[deviceId]) {
      console.log("设备:" + deviceId +"在线");
      clientState[deviceId] = false;
    }
    else {
        var Device = global.dbHandel.getModel('device');
        Device.update({deviceId:deviceId},{$set:{
            isActive:false
        }
        },function (err,doc) {
            console.log("设备:" + deviceId +"踢出");
            delete clientState[deviceId];
        });
    }
  }
},config.heartBeatCheckTime);

app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); 
    }
    else {
        next();
    }
});

app.use('/',function (req,res,next) {
    var deviceId = req.body.deviceId;
    if(deviceId){
        clientState[deviceId] = true;
        console.log("设备:" + deviceId + "在线");
    }
    next();
});

app.use('/', index);
app.use('/api/user', users);
app.use('/api/device', device);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
