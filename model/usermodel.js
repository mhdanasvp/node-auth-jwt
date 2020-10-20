const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minlength:3,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:3,
        maxlength:1024
    },
    password_confirmation:{
        type:String,
        required:true,
        minlength:3,
        maxlength:1024,
        
    },
    phone:{
        type:String,
        minlength:3,
        maxlength:255,
        required:true
    },
    address:{
        type:String,
        required:true,
        minlength:3,
        maxlength:255
    }

})

userSchema.pre("save",async function(next){
try {
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(this.password,salt)
    const hashPassword2=await bcrypt.hash(this.password_confirmation,salt)
    this.password=hashPassword
    this.password_confirmation=hashPassword2
    
} catch (error) {
    next(error)
}
})
userSchema.methods.isValidPassword=async function(password){
    try {
        return await bcrypt.compare(password,this.password)
    } catch (error) {
        throw error
    }
}







const User=mongoose.model("User",userSchema)

module.exports={User,userSchema}