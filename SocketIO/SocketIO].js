/**
 * Created by ASUS on 2017/7/19.
 */
var socket = require('socket.io');
module.exports = {
    io:null,
    sockets:{},
    create:function (http) {
        if(this.io == null) {
            this.io = socket(http);
            this.io.on('connect',function (socket) {
                socket.on('connectServer',function (data) {
                    var device = data.deviceId;
                    if(device) {
                        this.sockets[device] = socket;
                        socket.deviceId = device;
                    }
                });
                socket.on('connectOther',function (device) {
                    var otherSocket = this.sockets[device.deviceId];
                    if(otherSocket) {
                        otherSocket.emit('otherConnect',device);
                    }
                    else {
                        socket.emit('connectOtherResponse',{status:'error'});
                    }
                });
                socket.on('createClientServerSuccess',function (data) {
                    socket.emit('connectOtherResponse',{status:'success'});
                });
                socket.on('disconnect',function () {
                    var device = socket.deviceId;
                    if(device) {
                        delete this.sockets[device];
                        delete socket.deviceId;
                    }
                });
            });
        }
    }
};