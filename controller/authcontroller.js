const {User,userSchema}=require("../model/usermodel")
const {registerValidation,loginValidation}=require("../helpers/validation")
const Joi=require("joi")
const createError=require("http-errors")
const {signAccessToken,signRefreshToken,verifyRefreshToken}=require("../helpers/jwthelpers")
const client = require("../helpers/initredis")

module.exports={
    register:async(req,res,next)=>{
        try {
            
            const result=await registerValidation(req.body)
            if(result.password !== result.password_confirmation){throw createError.Unauthorized("password did'n match")}

            let user=new User(result)

            let doesExist=await User.findOne({email:result.email})
            if(doesExist) throw createError.Conflict(`${result.email} is already exist`)
            
            user=await user.save()
            let accessToken=await signAccessToken(user._id)
            let refreshToken=await signRefreshToken(user._id)
            res.cookie("accessToken",accessToken,{
                maxAge:2000,
                httpOnly:true,

            })
           res.json({user:user._id})
            
        } catch (error) {
            if(error.isJoi===true)
            error.status=422
            next(error)
        }
    },
    login:async(req,res,next)=>{
        try{
            
            const result=await loginValidation(req.body)
            const user=await User.findOne({email:result.email})
            if(!user) throw createError.NotFound("user not registered")
            const isMatch=await user.isValidPassword(result.password)
            if(!isMatch) throw createError.Unauthorized("username/password is not valid")
            const accessToken=await signAccessToken(user.id)
            const refreshToken=await signRefreshToken(user.id)
         
            

            

        }catch(error){
            if(error.isJoi===true)
            error.status=422
            next(error)
        }
    },
    refreshToken:async(req,res,next)=>{
        try {
            const {refreshToken}=req.body
            if(!refreshToken){
                throw createError.BadRequest()
            }
            const userId=await verifyRefreshToken(refreshToken)
            const accessToken=await signAccessToken(userId)
            const refToken=await signRefreshToken(userId)

            res.send({accessToken,refToken})
        } catch (error) {
            next(error)
        }
    },
    logout:async(req,res,next)=>{
        try {
            const{refreshToken} =req.body
            if(!refreshToken){
                throw createError.BadRequest()

            }
            const userId=await verifyRefreshToken(refreshToken)
            client.DEL(userId,(err,val)=>{
                if(err){
                    console.log(err.message);
                    throw createError.InternalServerError()
                }
                console.log(val);
                res.sendStatus(204)
            })

        } catch (error) {
            next(error)
        }
    }
}