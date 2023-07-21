
const { HandleEmailPasswordReset, HandleUsernamePasswordReset, VerifyCode, ResetPassword } = require("../../middleware/HandlePasswordReset");
const AuthMiddleware = require("../../middleware/authMiddleware");
const UserValidationChecker = require("../../middleware/createUserMiddleware");
const EmailVerifier = require("../../models/EmailVerifierModel");
const User = require("../../models/userModel");
const { sendVerificationMail } = require("../../services/mail/sendMail");
const { generateCode, encryptPassword } = require("../../utilities");

const app = require("express").Router()

app.post("/create-user",UserValidationChecker,async(req,res)=>{
    const {firstname,middlename,lastname,username,email,password} = req.body
    try {
        const currentUser= await new  User({firstname:firstname, middlename:middlename,lastname:lastname,
            username:username,email:email,password:await encryptPassword(password),metaData:{}
        }).save()
        if(currentUser){
            const code = generateCode(6)
            const emailVerifier = await new EmailVerifier({userId: currentUser,code}).save()
            await sendVerificationMail(email,firstname,code)
            const {confirmPassword,password,...other} =req.body
           return res.status(200).json({success:true,userDetails:other,isSendVerificationMail:emailVerifier!=null?true:false})
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
app.put("/rest-password/change",ResetPassword)

module.exports = app