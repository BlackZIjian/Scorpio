var express = require('express');
var router = express.Router();


router.post('/login',function (req,res,next) {
    var User = global.dbHandel.getModel('user');
    var uname = req.body.username;
    var upwd = req.body.password;
    var result = {
        status:500,
        description:"未知错误",
        data:""
    };
    User.findOne({name: uname},function(err,doc){
        if(err){
            result.description = err;
            console.log(err);
            res.send(result);
        }else if(doc){
            if(doc.password == upwd) {
                result.description = '登录成功';
                console.log(uname + '登录成功');
                result.status = 200;
                result.data = doc._id;
                res.send(result);
            }
            else {
                result.description = '密码错误';
                console.log(uname + '密码错误');
                result.status = 500;
                res.send(result);
            }
        }else{
            result.description = '用户名不存在！';
            console.log(uname + '用户名不存在！');
            res.send(result);
        }
    });
});
router.post('/regist', function(req, res, next) {
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
