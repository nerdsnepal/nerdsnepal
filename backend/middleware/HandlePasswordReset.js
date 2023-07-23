const PasswordReset = require("../models/passwordResetModel");
const User = require("../models/userModel")
const { PasswordResetService } = require("../services/other/otherservices");
const { isEmpty, isEqual, passwordStrengthChecker, encryptPassword } = require("../common/utils");
const { generateAuthToken } = require("./authToken");

const HandleEmailPasswordReset = async(req,res,next)=>{
    const {email,isEmail}= req.body
    if(!isEmail){next(); return}
    const currentUser =await User.findOne({email})
    try {
        if(!currentUser) throw new  Error("User doesn't exists")
        let serviceResult = await PasswordResetService(isEmail,currentUser)
        if(!serviceResult)  throw new  Error("Unable to serve your request")
       return res.status(200).json({success:true,message:"Password reset code sent"})
    } catch (error) {
       return res.status(400).json({success:false,error})
    }
}
const HandleUsernamePasswordReset = async(req,res)=>{
    const {username,isEmail}= req.body
    const currentUser =await User.findOne({username})
    try {
        if(!currentUser) throw new  Error("User doesn't exists")
        let serviceResult = await PasswordResetService(isEmail,currentUser)
        if(!serviceResult)  throw new  Error("Unable to serve your request")
       return res.status(200).json({success:true,message:"Password reset code sent"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,error})
       
    }
}

const VerifyCode =async (req,res)=>{
    const {username,email,resetCode}= req.body
    try {
    const currentUser = await User.findOne({$or:[{username},{email}]})
    let userId = currentUser._id
    const currentDate =new Date(Date.now()).toUTCString()
    const result =await PasswordReset.findOne({userId,resetCode,expire_date:{$gte:currentDate}})
    if(result){
        const passwordResetToken = generateAuthToken({date:Date.now(),userId,email:currentUser.email},'12h')
        await PasswordReset.updateOne({userId,resetCode},{isCodeUsed:true,passwordResetToken})
        const cookieOptions = {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24*2), // expires in 48 hours
            httpOnly: true, // prevents JavaScript from accessing the cookie
            secure:true
          };
        res.cookie('passwordResetToken',passwordResetToken,cookieOptions)
       return res.status(200).json({success:true,message:"verified"})
    }
    return res.status(422).json({success:false,error:{code:"invalid_code",message:"code doesn't match or expired"}})
    } catch (error) {
        //console.log(error);
       return res.json({success:false,message:"Something went wrong"}) 
    }
 
}

const ResetPassword = async(req,res)=>{
    const {password,confimPassword} =req.body
    let error =[]
    try {
        if(isEmpty(password)) error.push({"code":"password_empty","message":"field can't be empty"})
        if(isEmpty(confimPassword)) error.push({"code":"confimPassword_empty","message":"field can't be empty"})
        if(error.length>0)throw new Error("Error")
        if(!isEqual(password,confimPassword)) error.push({code:"not_matched",message:"password doesn't match"})
        if(passwordStrengthChecker(password)<1)error.push({code:"password_weak",message:"weak password"})
        if(error.length>0)throw new Error("Error")
        let value = req.cookies['passwordResetToken']
        let pswdReset =await PasswordReset.findOne({passwordResetToken:value})
        let userId = pswdReset.userId
        let userRes= await User.updateOne({_id:userId},{password:await encryptPassword(password)})
       if(!userRes) throw new Error("Error")
       return res.status(200).json({success:true,message:"password changed"}) 
    } catch (err) {
       //console.log(err);
        res.status(422).json({success:false,error}) 
    }
    
}


module.exports = {ResetPassword,HandleEmailPasswordReset,HandleUsernamePasswordReset,VerifyCode}