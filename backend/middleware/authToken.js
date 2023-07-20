const jwt = require("jsonwebtoken")
const { isEmpty } = require("../utilities")



// generate webtoken 
const generateAuthToken = (user,expireIn='48h')=>jwt.sign(user,process.env.SECRET_KEY, { expiresIn: expireIn})

const AuthenticationToken = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies['token']
    if(isEmpty(token)){
        res.status(401).json({type:"token_empty",message:"Invalid Token"})
        res.end()
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err) {
            res.status(401).json({type:"Error",message:err})
            res.end()
        }
        req.user = user
        next()
    })
}

module.exports = {generateAuthToken,AuthenticationToken}