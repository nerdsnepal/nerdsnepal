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

// number of cpu or core available 
const numCPUS = os.cpus().length

// Middleware 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


//handle routes
app.use("/admin/create/",createAdminRoute)
app.use("/account/",userAccountRoute)
app.use("/auth/",userAuthRoute)
app.use("/admin/category",categoryRoute)


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
