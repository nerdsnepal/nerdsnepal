const userModel = require("../../models/userModel")

const app = require("express").Router()

app.get("/users/:value",async(req,res)=>{
    const value = req.params.value
    let users = null
    try {
        if(value==="all"){
            users =await userModel.find({})
        }else{
            users =await userModel.find({$text:{$search:`${value}`}},{score:{$meta:"textScore"}})
            .sort( { score: { $meta: "textScore" } } ) 
        }
        
        res.json({
           success:true,
           users:users
        })
    } catch (error) {
        console.log(error);
        res.json({
            status:false,
            message:"Something went wrong"
        })
    }


})


module.exports = app 