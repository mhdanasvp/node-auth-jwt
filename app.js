const express = require('express');
const morgan=require("morgan")
const createError=require("http-errors")
const path=require("path")
const auth=require("./routes/authrouter")
const cookieParser=require("cookie-parser")
const {verifyAccessToken}=require("./helpers/jwthelpers")


require("dotenv").config()
require("./helpers/initmongoose")
require("./helpers/initredis")
const app=express()

app.use(cookieParser())


app.use(express.static("public"))
app.set("view engine",'ejs')

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))





app.get("/",verifyAccessToken,async(req,res,next)=>{
    console.log(req);
   res.send("hellooo from home")
})







app.use("/auth",auth)



app.use((req,res,next)=>{
    next(createError.NotFound())

})
app.use((err,req,res,next)=>{
    res.status(500)
    res.send({
        status:err.status,
        message:err.message
    })
})

const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`running on ${PORT}`);
})










