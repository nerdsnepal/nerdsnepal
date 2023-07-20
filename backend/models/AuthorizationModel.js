const { default: mongoose, Schema } = require("mongoose");

const UserAuthorizationSchema = mongoose.Schema({
    created_by:{type:Schema.Types.ObjectId,require:true},
    privilege_to:{type:Schema.Types.ObjectId,require:true},
    privilege:{type:Array,require:true},
    created_date:{type:Date, default:Date.now()},
    updated_date:{type:Date,default:null},
    updated_by:{type:Schema.Types.ObjectId,default:null},
})

module.exports = mongoose.model("userAuthorization",UserAuthorizationSchema)