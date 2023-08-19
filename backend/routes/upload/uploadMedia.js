const { AuthenticationToken } = require("../../middleware/authToken")
const { uploadProductMedia, compressAndReturnUrlMiddleware } = require("../../middleware/uploadMiddleware")
const MediaModel = require("../../models/MediaModel")
const fs = require("fs")
const app = require("express").Router()

/*
    Only the authenticated user can upload the file 
    and the middleware compress the file and return the corresponding 
    URI 


*/

app.post("/",AuthenticationToken,uploadProductMedia,compressAndReturnUrlMiddleware,async(req,res)=>{
    try{
        const {storeId} = req.body
        console.log(storeId);
        const {userId} = req.user 
        const currentUrls = req.uploadedUrl
        let urls = []
        for(let url of currentUrls){
            urls.push({url,alt:""})
        }
        await MediaModel({storeId,userId,urls}).save()
        return res.status(200).json({success:true,urls:currentUrls})
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,error:"Something went wrong"})
    }
})

app.delete('/',AuthenticationToken,async(req,res)=>{
    const {userId} = req.user 
    const {path,storeId} = req.body 
    try {
        const media = await MediaModel.findOne({userId,url:path,storeId})
        if(media){
            fs.unlinkSync(path)
            media.urls.pull({url:path})
            await media.save()
        }
        return res.json({success:true,message:"Deleted"})
    } catch (error) {
        return res.json({success:false,error:"Something went wrong"})
    }


})

module.exports = app 
