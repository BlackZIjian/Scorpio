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
    User.findOne({_id:_userId},function (err,doc) {
        if(err){
            result.description = err;
            console.log(err);
            res.send(result);
        }
        else {
            if(doc){

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
                            result.status = 200;
                            result.description = "已注册:" + deviceId + " 设备，更新登录用户为" + userId;
                            result.data = true;
                            res.send(result);
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
    var User = global.dbHandel.getModel('user');
    var uname = req.body.username;
    var upwd = req.body.password;
    var result = {
        status:500,
        description:"未知错误",
        data:""
    };
    User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式
        if(err){
            result.description = err;
            console.log(err);
            res.send(result);
        }else if(doc){
            result.description = '用户名已存在！';
            console.log('用户名已存在！');
            res.send(result);
        }else{
            User.create({                             // 创建一组user对象置入model
                name: uname,
                password: upwd,
                activeDevice:[],
                inactiveDevice:[]
            },function(err,doc){
                if (err) {
                    result.description = err;
                    console.log(err);
                    res.send(result);
                } else {
                    console.log('用户名创建成功！');
                    result.description = '用户名创建成功！';
                    result.status = 200;
                    result.data = doc._id;
                    res.send(result);

                }
            });
        }
    });
});

module.exports = router;
