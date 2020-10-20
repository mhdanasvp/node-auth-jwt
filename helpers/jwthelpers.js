const jwt=require("jsonwebtoken")
const createError=require("http-errors")
const client=require("../helpers/initredis")



module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={
                iss:"osperb.com",
                
                aud:userId
            }
            const secret=process.env.ACCESS_TOKEN_SECRET
            const options={
                expiresIn:"30s"
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err){
                    console.log(err.message);
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })

        })
    },
   verifyAccessToken:(req,res,next)=>{
       if(!req.headers["authorization"]){
           return next(createError.Unauthorized())

       }
       const authHeader=req.headers["authorization"]
       const bearerToken=authHeader.split(" ")
       const token=bearerToken[1]
       jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
           if(err){
               const message=err.name==="jsonWebTokenError" ? "Unauthorized":err.message
               next(createError.Unauthorized(message))
           }
           req.payload=payload
           next()
       })
   },
   signRefreshToken:(userId)=>{
    return new Promise((resolve,reject)=>{
        const payload={}
        const secret=process.env.REFRESH_TOKEN_SECRET
        const options={
            expiresIn:"1y",
            issuer:"osperb.in",
            audience:userId
        }
        jwt.sign(payload,secret,options,(err,token)=>{
            if(err){
                console.log(err);
                return reject(createError.InternalServerError())
            }
            client.SET(userId,token,"EX",365*24*60*60,(err,replay)=>{
                if(err){
                    console.log(err);
                    reject(createError.InternalServerError())
                    return
                }
                resolve(token)
            })
 
 
        })
    })
   },
   verifyRefreshToken:(refreshToken)=>{
       return new Promise((resolve,reject)=>{
           jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
               if(err){
                   return reject(createError.Unauthorized())
               }
               const userId=payload.aud
               client.GET(userId,(err,result)=>{
                   if(err){
                       console.log(err.message);
                       reject(createError.InternalServerError())
                       return
                   }
                   if(refreshToken===result){
                       resolve(userId)
                   }
                   reject(createError.Unauthorized())
               })
           })
       })
   }

}
