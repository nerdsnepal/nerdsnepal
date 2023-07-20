const { emailValidator, validateUserName, isEqual, passwordStrengthChecker } = require("../utilities");
const User = require("../models/UserModel")

const UserValidationChecker = async(req,res,next) =>{
    const {username,email,password,confirmPassword} = req.body;
    let error = []
    let errorIsEmpty=[]
    if(!username)errorIsEmpty.push("username field can't be empty")
    if(!email)errorIsEmpty.push("email field can't be empty")
    if(!password)errorIsEmpty.push("password field can't be empty")
    if(!confirmPassword)errorIsEmpty.push("confirmPassword field can't be empty")
    if(errorIsEmpty.length>0){
        res.status(400).json({success:false,error:errorIsEmpty})
        res.end()
        return
    }
    if(!emailValidator(email)) error.push("Invalid email")
    if(!validateUserName(username)) error.push("Invalid username")
    if(!isEqual(password,confirmPassword)) error.push("Password doesn't match")
    if(await User.findOne({email}))error.push("Duplicate email")
    if(await User.findOne({username})) error.push("Duplicate username")
    if(passwordStrengthChecker(password)<1) error.push("Weak password")
    if(error.length>0){
        res.status(400).json({success:false,error})
        res.end()
        return
    }
    next()

}

module.exports = UserValidationChecker