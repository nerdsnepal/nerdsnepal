const { AuthenticationToken } = require("../../middleware/authToken");
const Category = require("../../models/CategoryModel");

const app = require("express").Router()

app.post("/",AuthenticationToken,(req,res)=>{
   // console.log(req.user);
    Category({
        name:"abc",
        images:["a","v"],
        created_by:req.user.userId
    }).save().then(()=>{}).catch((err)=>{})

    res.json({})
});
app.get("/",async(req,res)=>{
   let categories = await Category.find({})
   res.status(200).json({status:true,categories})
})
app.delete("/",AuthenticationToken,async(req,res)=>{
    
})

module.exports = app 
