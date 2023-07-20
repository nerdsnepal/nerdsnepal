const PrivilegeModel = require("../models/PrivilegeModel")
const { isEmpty,isSuperUser } = require("../utilities")

const AddAuthorizationMiddleware = (req,res,next)=>{
    const {userType} = req.user
    const {name,apiUrl} = req.body
    let error = []
    try {
        if(!isSuperUser(userType)) error.push("Unauthorized user")
        if(isEmpty(name))  error.push("Privilege api name field empty")
        if(isEmpty(apiUrl))  error.push("Privilege api url field empty")
        if(error.length>0) throw new Error("Error") 
        next();
        return
    } catch (err) {
        res.status(422).json({status:false,error})
    }
}
 
const AddAuthorization = async(req,res)=>{
    const {userId} = req.user
    const {name,apiUrl} = req.body
   try {
     let result = await PrivilegeModel({name,apiUrl,userId}).save()
     if(!result) throw new Error("Error")
     res.status(200).json({status:true,message:"added successfully"})
    } catch (error) {
        res.status(422).json({
            status:false,
            error:{
                code:"unauthorized",
                message:"Unauthorized user"
            }
        })
   }
    

}

module.exports= {AddAuthorizationMiddleware,AddAuthorization}