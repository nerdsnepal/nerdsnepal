const UserValidationChecker = require("../../middleware/createUserMiddleware")
const EmailVerifier = require("../../models/EmailVerifierModel")
const User = require("../../models/userModel")
const { sendVerificationMail } = require("../../services/mail/sendMail")
const { isEqual, encryptPassword, generateCode, USERTYPE } = require("../../common/utils")

const router = require("express").Router()

router.post("/super-user",UserValidationChecker,async(req,res)=>{
    const {firstname,middlename,lastname,username,email,password} = req.body
    const apiKey = req.header('super-user-api-key')
    try {
        if(!isEqual(apiKey,process.env.SUPER_USER_CREATE_AUTH_KEY))throw new Error("Invalid apikey")
        const currentUser= await new  User({firstname:firstname, middlename:middlename,lastname:lastname,
            username:username,email:email,password:await encryptPassword(password),metaData:{},
            userType:USERTYPE.SUPERUSER
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


module.exports = router

