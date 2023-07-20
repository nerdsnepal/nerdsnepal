/*
 This middleware is use to know the email-login is done through 
 email or username and also check if the given email or username is valid or not
 if not then it response as a failure 
 otherwise it will procceed next step

*/

const { emailValidator, validateUserName } = require("../utilities")
const AuthMiddleware = (req,res,next)=>{
    const {username,email} = req.body 
    let isEmail =null 
    if(username)isEmail=false 
     if(email)isEmail = true
     let error = []
     try {
        if(isEmail===null)error.push("email or username field can't be empty")
        if(error.length>0)throw new Error("Error")
        if(isEmail) {if(!emailValidator(email))error.push("Invalid email")}
        else if(!validateUserName(username)) error.push("Invalid username")
        if(error.length>0)throw new Error("Error")
         req.body.isEmail = isEmail 
         next()
     } catch (err) {
        res.status(400).json({success:false,error})
       return res.end()
     }

    
}

module.exports = AuthMiddleware
