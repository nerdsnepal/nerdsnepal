const { default: mongoose } = require("mongoose");
const { USERTYPE } = require("../utilities");

const UserSchema = new mongoose.Schema(
    {
        firstname:{type:String,require:true},
        middlename:{type:String,require:false,default:""},
        lastname:{type:String,require:true},
        username:{type:String,require:true,unique:true},
        email:{type:String,require:true,unique:true},
        isVerified:{type:String,default:false},
        profile:{type:String,require:false, default:"/profile/profile.jpg"},
        address:{type:Object,default:null},
        password:{type:String,require:true},
        userType:{type:String,require:false,default:USERTYPE.DEFAULT},
        creation_date:{type:Date,require:true,default:Date.now()},
        gender: {type:String,enum:["Male","Female","Other","Prefer not to say"],default:"Prefer not to say"},
        metaData:{type:Object,require:false}
    }
)




module.exports = mongoose.model("user",UserSchema)