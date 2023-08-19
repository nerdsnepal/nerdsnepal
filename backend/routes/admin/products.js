const { USERTYPE } = require("../../common/utils")
const { AuthenticationToken } = require("../../middleware/authToken")
const productModel = require("../../models/productModel")
const { AddProductMiddleware } = require("./middleware/product-add-middleware")
const { StoreAuthorization } = require("./store/middleware/check-authorization")

const app = require("express").Router()


app.post('/',AuthenticationToken,StoreAuthorization,AddProductMiddleware,async(req,res)=>{
  
    try {
        let result = null 

        const {role} = req.user 
       const {product} =req
    //   console.log(req);
       if(role===USERTYPE.MERCHANT){
         result = await productModel({...product}).save()
        
       }else if(role===USERTYPE.EMPLOYEE){
        //check for permission
         result= await productModel({...product}).save()
       }
      if(result){
        return res.status(200).json({success:true,message:"Product Added"})
      }else{
        return res.status(200).json({success:true,message:"Fail to add a product"})
      }
     
    } catch (error) {
       
       return res.status(501).json({success:false,error})
    }
})

app.get('/',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {selected} = req.query||'all' 
    const {storeId} = req.query
    try {
        let products = null
        if(selected.toLowerCase()==='all')products =await productModel.find({storeId:storeId})
        else if(selected.toLocaleLowerCase()==='true')
        products =await productModel.find({storeId:storeId,status:true})
        else products =await productModel.find({storeId:storeId,status:false})
        return res.status(200).json({success:true,products})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
  
})




module.exports = app 