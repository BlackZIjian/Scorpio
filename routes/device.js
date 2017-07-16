var express = require('express');
var router = express.Router();


router.post('/set',function (req,res,next) {
    var Device = global.dbHandel.getModel('device');
    var type = req.body.type;
    var ip = req.body.ip;
    var userId = req.body.userId;
    var deviceId = req.body.deviceId;
    var result = {
        status:500,
        description:"未知错误",
        data:""
    };
    var _userId = null;
    try {
        _userId = global.ObjectId(userId);
    }
    catch(err) {
        result.description = "userId:" + userId + "格式错误";
        console.log("userId:" + userId + "格式错误");
        res.send(result);
        return;
    }
    var User = global.dbHandel.getModel('user');
    User.findOne({_id:_userId},function (err,udoc) {
        if(err){
            result.description = err;
            console.log(err);
            res.send(result);
        }
        else {
            if(udoc){
                Device.update({deviceId:deviceId},{
                    deviceId:deviceId,
                    type:type,
                    ip:ip,
                    userId:userId,
                    isActive:true
                },{
                    upsert:true
                },function (err,doc) {
                    if(err) {
                        result.description = err;
                        console.log(err);
                        res.send(result);
                    }
                    else {
                        if (doc.ok > 0) {
                            var devices = udoc.devices;
                            if(devices == null) {
                                devices = [];
                            }
                            devices.push(deviceId);
                            User.update({_id:_userId},{
                                $set:{devices:devices}
                            },function (err,doc) {
                                result.status = 200;
                                result.description = "已注册:" + deviceId + " 设备，更新登录用户为" + userId;
                                result.data = true;
                                res.send(result);
                            });
                        }
                        else  {
                            res.send(result);
                        }
                    }
                })
            }
            else {
                result.description = "用户ID:" + userId +" 不存在";
                console.log("用户ID:" + userId +" 不存在");
                res.send(result);
            }
        }
    });
});
router.get('/get', function(req, res, next) {
    var Device = global.dbHandel.getModel('device');
    var userId = req.query.userId;
    var _userId = null;
    try {
        _userId = global.ObjectId(userId);
    }
    catch(err) {
        result.description = "userId:" + userId + "格式错误";
        console.log("userId:" + userId + "格式错误");
        res.send(result);
        return;
    }
    var result = {
        status:500,
        description:"未知错误",
        data:""
    };
    var User = global.dbHandel.getModel('user');
    User.findOne({_id:_userId},function (err,udoc) {
        if(err){
            result.description = err;
            console.log(err);
            res.send(result);
        }
        else {
            if(udoc){
                var deviceIds = udoc.devices;
                if(deviceIds == null)
                    deviceIds = [];
                var devices = [];
                for(var i=0;i<deviceIds.length;i++) {
                    var deviceId =deviceIds[i];
                    Device.findOne({deviceId:deviceId},function (err,doc) {
                        if(err){
                            result.description = err;
                            console.log(err);
                            res.send(result);
                            return;
                        }
                        else {
                            if(doc) {
                                devices.push(doc);
                                if(devices.length == deviceIds.length) {
                                    result.status = 200;
                                    result.data = devices;
                                    result.description = "获取全部设备成功";
                                    res.send(result);
                                    return;
                                }
                            }
                            else  {
                                res.send(result);
                                return;
                            }
                        }
                    })
                }
            }
            else {
                result.description = "用户ID:" + userId +" 不存在";
                console.log("用户ID:" + userId +" 不存在");
                res.send(result);
            }
        }
    });
});

module.exports = router;
