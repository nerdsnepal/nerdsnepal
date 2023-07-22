const { checkExistsAndDelete, compressImageAndSave } = require("../../common/compress");
const { isEmpty } = require("../../common/utilities");
const { AuthenticationToken } = require("../../middleware/authToken");
const { uploadProfile } = require("../../middleware/storage");
const userModel = require("../../models/userModel");
const app = require("express").Router()


app.post("/",AuthenticationToken,uploadProfile,async(req,res)=>{
    let path = ""
    try {
        const {destination,filename} = req.file
        const {userId} = req.user
         path = await compressImageAndSave(destination,filename);
         const {profile} = await userModel.findOne({_id:userId})
        const {acknowledged}= await userModel.updateOne({_id:userId},{profile:path})
        if(!acknowledged)throw new Error("Error")
        checkExistsAndDelete(profile)
        return res.status(422).json({
            status:true,
            result:{
                message: "Profile uploaded successfully",
                profileUrl:path
            }
        })
    } catch (error) {
        console.log(error);
        checkExistsAndDelete(path)
        return res.status(422).json({
            status:false,
            message:"failed to upload profile"
        })
    }
})

app.delete("/",AuthenticationToken,async(req,res)=>{
        const {userId} = req.user 
        try {
            const {profile} = await userModel.findOne({_id:userId})
            if(isEmpty(profile)) return res.status(422).json({
                status:true,
                message:"Removed profile"
            })
            else 
            if(!checkExistsAndDelete(profile))throw new Error("error")
            
            const {acknowledged}= await userModel.updateOne({_id:userId},{profile:""})
           if(!acknowledged)throw new Error("Error")
           return res.status(422).json({
            status:true,
            message:"Removed profile"
        })
        } catch (error) {
            console.log(error);
            return res.status(422).json({
                status:false,
                message:"Failed to remove profile"
            })
        }
})

module.exports = app