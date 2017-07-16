/**
 * Created by ASUS on 2017/7/11.
 */
module.exports = {
    user:{
        name:{type:String,required:true},
        password:{type:String,required:true},
        devices:{type:Array,required:false}
    },
    device:{
        deviceId:{type:String,required:true},
        type:{type:String,required:true},
        ip:{type:String,required:true},
        isActive:{type:Boolean,required:true},
        userId:{type:String,required:true}
    }
};