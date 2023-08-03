const { USERTYPE } = require("../../../common/utils")
const { AuthenticationToken } = require("../../../middleware/authToken")
const userModel = require("../../../models/userModel")
const CheckSuperAdmin = require("../middleware/checkSuperAdmin")
const { CreateStoreValidatorMiddleware } = require("./middleware/middleware")
const StoreModel = require("./model/StoreModel")

const router = require("express").Router()
// for creating store to the user 
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
        res.status(200).json({success:false,error:"Failed to create store"})
    }



})

/*get all the stores information 
only accessible to the super user 

*/
router.get("/",AuthenticationToken,async(req,res)=>{
    const {userId,role}= req.user
    console.log(req.user); 
    try {
        let stores = null
        console.log(role); 
        if(role===USERTYPE.SUPERUSER){
            stores = await StoreModel.find()
        }else{
            stores = await StoreModel.find({merchantId:userId})
        }
        res.status(200).json({success:true,stores})
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

router.get("/:merchantId",AuthenticationToken,CheckSuperAdmin,async(req,res)=>{
    const merchantId = req.params.merchantId
    try {
       const stores = await StoreModel.find({merchantId:merchantId})
       res.status(200).json({success:true,stores})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Invalid merchant id"
        }) 
    }
})


module.exports = router
