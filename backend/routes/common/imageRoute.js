const app = require("express").Router()
const fs = require("fs")

app.get("/:dirname/:filename",(req,res)=>{
    const {dirname,filename} = req.params;
    const filePath = `${process.cwd()}/assets/images/${dirname}/${filename}`
    if(!fs.existsSync(filePath)){
        return res.status(422).json({status:false,message:"resource not found"})
    }
    const createReadStream = fs.createReadStream(filePath)
    res.status(200)
    res.writeHead(200,{'Content-Type':'image/*'})
    createReadStream.pipe(res)
})

module.exports = app 