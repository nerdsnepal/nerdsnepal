const { default: mongoose, Schema } = require("mongoose");


const PrivilegeModelSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    apiUrl :{type:String,required:true,unique:true},
    created_by:{type:Schema.Types.ObjectId,require:true}
})

module.exports = mongoose.model("privilege",PrivilegeModelSchema)