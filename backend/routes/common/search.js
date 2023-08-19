const { default: mongoose } = require("mongoose")
const { AuthenticationToken } = require("../../middleware/authToken")
const userModel = require("../../models/userModel")
const { isEmpty } = require("../../common/utils")

const app = require("express").Router()

app.get("/users/:value",async(req,res)=>{
    const value = req.params.value
    let users = null
    try {
        if(value==="all"){
            users =await userModel.find({})
        }else{
            users =await userModel.find({$text:{$search:`${value}`}},{score:{$meta:"textScore"}})
            .sort( { score: { $meta: "textScore" } } ) 
        }
        
        res.json({
           success:true,
           users:users
        })
    } catch (error) {
        console.log(error);
        res.json({
            status:false,
            message:"Something went wrong"
        })
    }


})
app.get('/user',AuthenticationToken,async(req,res)=>{
   try {
    let {userIds} = req.query
    userIds = userIds?.split(',')
    if(userIds && isEmpty(userIds[0])){
        throw new Error("Something went wrong")
    }
    console.log(userIds);
    let users = await userModel.find({_id:{$in:userIds}})
    users = users?.map((user)=>{
        user.password= undefined
        user.address = undefined
        user.metaData= undefined
        user.creation_date = undefined
        return user 
    })
    return res.json({success:true,users})
   } catch (error) {
    console.log(error);
        return res.status(500).json({success:false,error:"Something went wrong"})
   }
})

module.exports = app 