const { default: mongoose, Schema } = require("mongoose");


const ProductSchema = mongoose.Schema({
    storeId:{type:Schema.Types.ObjectId,require:true,ref:"stores"},
    created_by:{type:Schema.Types.ObjectId,require:true,ref:"users"},
    created_at:{type:Date,default:Date.now()},
    updated:[
        {
            type:Object,
            properties:{
                updated_by:{type:Schema.Types.ObjectId,require:true,ref:"users"},
                updated_at:{type:Date,default:Date.now()}
            }
        }
    ],
    name:{type:String,require:true},
    description:{type:String,default:""},
    status:{type:Boolean,default:false},
    price:{
        type:Object,
        properties:{
            mrp:{type:Number},
            compare_at:{type:Number,default:null}
        }
    },
    tax:{type:Boolean,default:false},
    costPrice:{type:Number,default:null},
    mediaUrls:{type:Array,require:true},
    variants:[
        {
            type:Object,
            properties:{
                name:{type:String,default:''},
                value:{type:Array,default:[]}
            }
        }
    ],
    seo:{
        title:{type:String,require:false,default:""},
        description:{type:String,require:false,default:''}
    },
    category:{
        name:{type:String,default:""},
        subcategory:{type:Array,default:[]}
    },
    inventory:{
        quantities:[{
            location:{type:String,default:null},
            quantity:{type:Number,default:0}
        }],
        sku:{type:String,default:null},
        isExpire:{type:Boolean,default:false},
        expireDate:{type:Date,default:null}
    }

})
ProductSchema.index({
    name:String,
    description:String
})

module.exports = mongoose.model("products",ProductSchema)