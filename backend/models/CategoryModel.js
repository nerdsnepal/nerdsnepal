const { default: mongoose, Schema } = require("mongoose");

const CategorySchema = mongoose.Schema({
    name:{type:String,require:true},
    images:[
            {
                type:Object,
                properties:{
                    uploaded_by:{type:Schema.Types.ObjectId,ref:"users"},
                    uploaded_at:{type:Date,default:Date.now(),require:true},
                    url:{type:String,required:true}
                }
            }
    ],
    created_by:{type:Schema.Types.ObjectId,ref:"users",required:true},
    updated_by:{type:Schema.Types.ObjectId,ref:"users",required:true},
    updated_date:{type:Date,default:Date.now()},
    creation_date:{type:Date,default:Date.now()}   
})
module.exports = mongoose.model("category",CategorySchema)