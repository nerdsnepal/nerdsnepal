
const { HandleEmailPasswordReset, HandleUsernamePasswordReset, VerifyCode, ResetPassword } = require("../../middleware/HandlePasswordReset");
const AuthMiddleware = require("../../middleware/authMiddleware");
const UserValidationChecker = require("../../middleware/createUserMiddleware");
const EmailVerifier = require("../../models/EmailVerifierModel");
const User = require("../../models/userModel");
const { sendVerificationMail } = require("../../services/mail/sendMail");
const { generateCode, encryptPassword, url } = require("../../common/utils");
const userModel = require("../../models/userModel");
const { PasswordResetService } = require("../../services/other/otherservices");
const passwordResetModel = require("../../models/passwordResetModel");
const { generateAuthToken } = require("../../middleware/authToken");

const app = require("express").Router()

app.post("/create-user",UserValidationChecker,async(req,res)=>{
    
    const {fullname,username,email,password} = req.body
    try {
        const currentUser= await new  User({name:fullname,
            username:username,email:email,password:await encryptPassword(password),metaData:req.meta}).save()
        if(currentUser){
            const code = generateCode(6)
            const emailVerifier = await new EmailVerifier({userId: currentUser,code}).save()
            await sendVerificationMail(email,fullname,code)
            const {confirmPassword,password,...other} =req.body
           return res.status(200).json({success:true,userDetails:other,isSendVerificationMail:emailVerifier!=null?true:false,message:"Thanks for creating your account. Please verify your email."})
        }
    } catch (error) {
       return res.status(201).json({success:false,...error})
    }
})

/*
Used to reset password of the user
Reset Password By: username or email 

*/

app.post("/reset-password",AuthMiddleware,HandleEmailPasswordReset,HandleUsernamePasswordReset)
app.post("/verify/reset-code",AuthMiddleware,VerifyCode)
app.patch("/reset-password/change",ResetPassword)
app.get('/send-reset-link',async(req,res)=>{
    const {email} = req.query
    try {
        const user =  await userModel.findOne({email})
        if(!user){
            throw new Error("Enter a valid email address")
        }
       const result = await  PasswordResetService(true,user,true)
        return res.status(200).json({success:result,message:result?"Email has been sent! Please check your mail.":"Looks like you have either entered wrong email address or the email has not been registered yet."});
    } catch (error) {
        return res.status(501).json({success:false,error:"Looks like you have either entered wrong email address or the email has not been registered yet."})
    } 
})
app.get('/verify-code',async(req,res)=>{
    const {token} = req.query 
    //const url = `${req.protocol}://${req.headers.host}`;
    let resetToken =null 
    let expire = false 
    try {
        const result = await passwordResetModel.findOne({resetCode:token})
        if(result){
            await passwordResetModel.updateOne({_id:result._id},{isCodeUsed:true});
            const currentDate = Date.now();
            console.log(Date.now());
            const expire_date = new Date(result.expire_date).getTime()
            if(currentDate<expire_date){
               expire = true
            }
            const userId = result.userId
            resetToken = generateAuthToken({token,userId},'5min')
            const _update = await passwordResetModel.updateOne({resetCode:token},{
                passwordResetToken:resetToken
            })
            if(_update){expire=false}else{expire=true}
        }
    } catch (error) {
        expire = true 
    }finally{
   
        return res.status(200).json({
            success:true,
            isExpire:expire,
            resetToken:expire?null:resetToken
        })
    }
})

module.exports = app