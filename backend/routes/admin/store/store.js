const { USERTYPE } = require("../../../common/utils")
const { AuthenticationToken } = require("../../../middleware/authToken")
const userModel = require("../../../models/userModel")
const CheckSuperAdmin = require("../middleware/checkSuperAdmin")
const { CreateStoreValidatorMiddleware } = require("./middleware/middleware")
const StoreModel = require("./model/StoreModel")

const router = require("express").Router()

router.post("/create",AuthenticationToken,CheckSuperAdmin,CreateStoreValidatorMiddleware,async(req,res)=>{
    const {userId} = req.user 
    const {name,merchantId}= req.body
    try {
        //create a store 
    await new StoreModel({created_by: userId,name,merchantId}).save()
    // update user to merchant
    if(userId!==merchantId){
    await userModel.updateOne({_id:merchantId},{role:USERTYPE.MERCHANT}) 
    } 

    res.json({success:true,message:"Store Created Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Internal Server error"})
    }



})

router.get("/merchant-store",AuthenticationToken,async(req,res)=>{
    const {userId} = req.user 
    try{
        const stores =await StoreModel.find({merchantId:userId})
        return res.json({status:true,stores})
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
})

module.exports = router
