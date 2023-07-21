/* login or authenticate the user by
email or username and password 
*/
const app  = require("express").Router()
const AuthMiddleware = require("../../middleware/authMiddleware")
const { generateAuthToken } = require("../../middleware/authToken")
const User = require("../../models/userModel")
const { comparePassword, isEmpty } = require("../../utilities")

app.post("/email-login",AuthMiddleware,async(req,res)=>{
     let {username,email,password,isEmail} = req.body
     try {
        if(isEmpty(password))throw new Error("password field can't be empty")
        let currentUser = null 
        if(isEmail){
        currentUser= await User.findOne({email})
        }else{
            currentUser= await User.findOne({username})
        }
        if(currentUser===null) {
            res.status(400).json({success:false,isLogin:false,message:"Invalid credentials"})
            return
        }
        if(await comparePassword(password,currentUser.password)){
            let token = generateAuthToken({userId:currentUser._id,username:currentUser.username,
                email:currentUser.email,isAdmin:false,userType:currentUser.userType})
            const cookieOptions = {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24*2), // expires in 24 hours
                httpOnly: true, // prevents JavaScript from accessing the cookie
                secure:true
              };
            res.cookie('token',token,cookieOptions)
            res.status(200).json({success:true,isLogin:true,message:"Successully login"})
            res.end()
        }else{
            res.status(400).json({success:false,isLogin:false,message:"Invalid credentials"})
        }
     } catch (err) {
        res.status(400).json({success:false,isLogin:false,message:"Invalid credentials"})
     }
    
})


module.exports = app 

