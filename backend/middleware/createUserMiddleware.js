const { emailValidator, validateUserName, isEqual, passwordStrengthChecker } = require("../common/utils");
const User = require("../models/userModel")

const UserValidationChecker = async(req,res,next) =>{
    const {username,email,password,confirmPassword} = req.body;
    let error = []
    if(!username)error.push("username field can't be empty")
    if(!email)error.push("email field can't be empty")
    if(!password)error.push("password field can't be empty")
    if(!confirmPassword)error.push("confirmPassword field can't be empty")
    //if there is any field is empty then it will response immediately 
    if(error.length>0)return  res.status(422).json({success:false,error:errorIsEmpty})
     
    if(!emailValidator(email)) error.push("Invalid email")
    if(!validateUserName(username)) error.push("Invalid username")
    if(!isEqual(password,confirmPassword)) error.push("Password doesn't match")
    if(await User.findOne({email}))error.push("Duplicate email")
    if(await User.findOne({username})) error.push("Duplicate username")
    if(passwordStrengthChecker(password)<1) error.push("Weak password")
    if(error.length>0) return res.status(400).json({success:false,error})
    next()

}

module.exports = UserValidationChecker