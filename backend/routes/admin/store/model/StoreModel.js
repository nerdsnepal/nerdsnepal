const { default: mongoose, Schema } = require("mongoose");
const { SUBSCRIPTIONLEVEL, SUBSCRIPTIONMODEL } = require("../../../../common/utils");


const StoreModelSchema = mongoose.Schema({
    created_by:{type:Schema.Types.ObjectId,require:true,ref:"users"},
    creation_date:{type:Date,require:true,default:Date.now()},
    name:{type:String,require:true,unique:true},
    displayName:{type:String},
    isSubdomain:{type:Boolean,require:true,default:false},
    domainName:{type:String,require:false,unique:false},
    emails:{type:Array},
    merchantId:{type:Schema.Types.ObjectId,require:true,unique:false,ref:"users"},
    logo:{type:String},
    status:{type:Boolean,require:true,default:false},
    websiteLayout:[],
    address:{type:Object,properties:{
        country:{type:String},
        postalCode:{type:Number},
        street:{type:String},
        geocoordinate:{type:Object,properties:{
            latitude:{type:String},
            longitude :{type:String}
        }}
    }},
    paymentMethod:[
        {
            type:Object,
            properties:{
                type:{type:String,require:true},
                paymentMerchantId:{type:String,require:true}
            }
        }
    ],
    subscriptionDetails:[{
        type:Object,
        properties:{
            paymentMethod:{type:String},
            subscribed_date:{type:Date},
            expire_on:{type:Date},
            isExpire:{type:Boolean,require:false,default:false},
            subscriptionLevel:{type:String,default:SUBSCRIPTIONLEVEL.Basic},
            subscriptionModel:{type:String,default:SUBSCRIPTIONMODEL.Freemium}
        }

    }]
})

module.exports = mongoose.model("store",StoreModelSchema)