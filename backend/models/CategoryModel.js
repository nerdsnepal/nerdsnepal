const { default: mongoose, Schema } = require("mongoose");

const CategorySchema = mongoose.Schema({
    name:{type:String,require:true},
    images:{type:Array,require:true},
    created_by:{type:Schema.Types.ObjectId,ref:"users",required:true},
    creation_date:{type:Date,default:Date.now()},
    status:{type:Boolean,default:false}
})
module.exports = mongoose.model("category",CategorySchema)