const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cluster = require("cluster")
const  os = require("node:os")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const createAdminRoute = require("./routes/admin/user")
const userAccountRoute = require("./routes/client/user")
const userAuthRoute = require("./routes/client/auth")
const categoryRoute = require("./routes/admin/category")
const { uploadProductMedia } = require("./middleware/uploadMiddleware")
const { AuthenticationToken } = require("./middleware/authToken")
const path = require("path")
const { compressImageAndSave} = require("./common/compress")
const imageRoute = require("./routes/common/imageRoute")
const userAvatarRoute = require("./routes/common/userProfile")
const cors = require("cors")
const userModel = require("./models/userModel")
const storeRoute = require("./routes/admin/store/store")
const searchRoute = require("./routes/common/search")
// number of cpu or core available 
const numCPUS = os.cpus().length



// Middleware 
app.use('*',cors({
    origin:true,
    credentials:true
}))
app.set('assets', path.join(__dirname, 'assets'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

//root 
app.get('/',AuthenticationToken,async(req,res)=>{
    const {userId} = req.user 
    const  user= await userModel.findOne({_id:userId})
    user.password = undefined
    user.address = undefined
    user.creation_date = undefined
    res.json({
        success:true,
        message:"Authenticated user",
        user
    })
})

//handle routes
app.use('/assets/images',imageRoute)
app.use("/admin/create/",createAdminRoute)
app.use("/store",storeRoute)
app.use("/account/",userAccountRoute)
app.use("/auth/",userAuthRoute)
app.use("/admin/category",categoryRoute)
app.use("/user/profile",userAvatarRoute)
app.use("/search/",searchRoute)


app.post("/media",AuthenticationToken,uploadProductMedia,async(req,res)=>{
    const files = req.files
    try {
        for (let file of files) {
            const {destination,filename} = file 
            console.log(file);
            console.log(await compressImageAndSave(destination,filename));
        }
    } catch (error) {
        console.log(error);
    }
    res.send(req.file)
})

//connection to the mongodb
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(()=>{
    console.log("Connection successful");
})
.catch((err)=>{
    console.log("Connection failed");
})

// start the primary process 
if(cluster.isPrimary){
    for(let i=0;i<numCPUS;i++)cluster.fork()
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
}else{
    //listening to the port 
    app.listen(process.env.PORT||5000,()=>{
        console.log("Hey I am listening you!!");
    })
    console.log(`Worker ${process.pid} started`);
}
