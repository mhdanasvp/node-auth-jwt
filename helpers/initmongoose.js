const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,{
    dbName:process.env.DB_NAME,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex:true
})
.then(()=>{console.log("connected mongodb...")})
.catch((err)=>{console.log(err)})


mongoose.connection.on(
    "connected",()=>{console.log("mongoose connected to db")}
)
mongoose.connection.on(
    "error",(err)=>{console.log(err.message);}
)
mongoose.connection.on(
    "disconnected",()=>{console.log("mongoose connection disconnected");}
)

process.on("SIGINT",async()=>{
    await mongoose.connection.close()
    process.exit(0)
})