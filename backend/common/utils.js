const bcrypt = require("bcrypt")
const  USERTYPE = {
    DEFAULT:"user",
    EMPLOYEE:"employee",
    MERCHANT:"merchant",
    PATNERSHIP:"partnership",
    SUPERUSER:"superuser",
    COSTUMER:"costumer"
}

const emailValidator= (email)=>email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
const validateUserName  = (username)=>username.match( /^[a-zA-Z0-9_]{5,29}$/)

/*
    This function return integer value as a  strength of the password 
    0-> Weak Password 
    1 -> Medium Password
    2 -> Strong Password
*/
const passwordStrengthChecker = (password)=>{
    const strengthRegex = [/^(?=.*[a-z]).{6,}$/,/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{10,}$/]
    let strength = -1
    for(let index=0;index<strengthRegex.length;index++)
        if(password.match(strengthRegex[index]))++strength
    return strength
}

const isEqual = (firstValue,secondValue)=> firstValue === secondValue

// to generate the random code 
const generateCode=(len)=> {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

const encryptPassword = async(password)=>{
    const saltRounds = 10;
    return await bcrypt.hash(password,saltRounds) 
}
const generateHash = (value)=> {
    let crypto = require("node:crypto") 
    return crypto.createHash("md5").update(`${value}${new Date().getTime()}`).digest('hex')
}
const comparePassword = async (password,hash)=> await  bcrypt.compare(password,hash)

const isEmpty= (value)=> value===undefined||value===""||value===null

const isSuperUser = (userType)=>userType === USERTYPE.SUPERUSER




module.exports = {generateHash,
    USERTYPE,isSuperUser,isEmpty,comparePassword,
    emailValidator,validateUserName,passwordStrengthChecker,
    isEqual,generateCode,encryptPassword}
