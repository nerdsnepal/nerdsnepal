const CategoryModel = require("../models/CategoryModel")



exports.getAllCategoryById =async ({userId})=>{
    if(userId){
        //get the userId according to the user 
        return await CategoryModel.find({}) 
    }
    return await CategoryModel.find({}) 
}

exports.getAllCategoryByStatus =async ({userId=undefined,status=true})=>{
    if(userId){
        //get the userId according to the user 
        return await CategoryModel.find({status}) 
    }
   
    return await CategoryModel.find({status}) 
}