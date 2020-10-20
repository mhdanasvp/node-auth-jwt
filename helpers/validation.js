const Joi=require("joi")





function registerValidation(req){
    const registerSchema=Joi.object({
        username:Joi.string().min(3).max(255).required(),
        email:Joi.string().min(3).max(255).lowercase().required().email(),
        password:Joi.string().min(3).max(255).required(),
        password_confirmation:Joi.string().min(3).max(255).required(),
        
        address:Joi.string().min(3).max(255).required(),
        phone:Joi.string().min(3).max(255).required()



    })
    return registerSchema.validateAsync(req)
    
}
function loginValidation(req) {
    const loginSchema=Joi.object({
        email:Joi.string().min(3).max(255).lowercase().required().email(),
        password:Joi.string().min(3).max(255).required()

    })
    return loginSchema.validateAsync(req)
}
module.exports={registerValidation,loginValidation}