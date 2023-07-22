// for handling multipart/form-data (for uploading files)
const multer = require("multer")
const fs = require("fs")
const { generateHash } = require("../common/utilities")
const path = require("path")
const rootDir = 'assets'
const allowedMimeType = [
    "image/jpg","image/jpeg","image/png","image/gif",
    "video/mp4","video/avi"
]
if(!fs.existsSync(rootDir)) fs.mkdirSync(rootDir)
const extension = (mimeType)=> mimeType.split('/')[1]
//storage for files 
let storage =(directory)=> multer.diskStorage({
    destination: (req,file,cb)=>{
        let dir = `${rootDir}/${directory}`
        if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true})
        cb(null,dir)
    },
    filename:(req,file,cb)=>{
        let {username} = req.user
        if(!allowedMimeType.includes(file.mimetype)) {
           return cb(new Error("File extension not allowed"))
        }
        let filename = `${generateHash(username)}.${extension(file.mimetype)}`
        cb(null,filename)
    }
}) 

const uploadProfile = multer({ storage: storage("images/profile") ,
    limits:{
        files:1
    }
}).single('profile')


const uploadProductMedia = multer({storage:storage("images/media"),
limits:{
    files:25,
}
}).array('media')





module.exports = {uploadProfile,uploadProductMedia}