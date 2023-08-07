const { isEmpty } = require("../../common/utils");
const { AuthenticationToken } = require("../../middleware/authToken");
const { uploadProductMedia, compressAndReturnUrlMiddleware } = require("../../middleware/uploadMiddleware");
const Category = require("../../models/CategoryModel");
const app = require("express").Router()



app.post("/",AuthenticationToken,async(req,res)=>{
    try {
        const {name,status,urls} =req.body
        const date = Date.now()
        const {userId} =req.user 
        let images = []
        for(const url of urls){
            images.push({url,uploaded_by:userId,uploaded_at:date})
        }
       await Category({name,images,status,created_by:userId,updated_by:userId}).save()
        return res.status(200).json({status:true,message:"Category created"})
    } catch (error) {
        console.log(error);
       return res.status(500).json({status:false,message:"Internal server error"})
    }
});

app.put("/",AuthenticationToken,uploadProductMedia,compressAndReturnUrlMiddleware,async(req,res)=>{
    try {
        const {name,_id} =req.body
        const {userId} =req.user 
        let images = []
        for(const url of req.uploadedUrl){
            images.push({url,uploaded_by:userId})
        }
        let update = null 
        if(isEmpty(name) && images.length===0)update={}
        if(!isEmpty){
            if(images.length>0) update={images}
        }else update={name}
        if(!isEmpty(name) && images.length>0) update={images,name}
        
        console.log(update);
       await Category.updateOne({_id},update)
        return res.status(200).json({status:true,message:"Category updated"})
    } catch (error) {

        console.log(error);
       return res.status(500).json({status:false,message:"Internal server error"})
    }
});


app.get("/",async(req,res)=>{
    console.log(req.cookies);
   let categories = await Category.find({})
//   res.setHeader('Access-Control-Allow-Origin','*')
   res.status(200).json({status:true,categories})
})
app.delete("/",AuthenticationToken,async(req,res)=>{
    
})

module.exports = app 
