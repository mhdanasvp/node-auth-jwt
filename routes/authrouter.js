const express = require('express');
const router=express.Router();
const {register,login,refreshToken,logout}=require("../controller/authcontroller")
const{verifyAccessToken}=require("../helpers/jwthelpers")

router.post("/register",register)
router.post("/login",login)
router.post("/refreshToken",refreshToken)
router.delete("/logout",logout)


router.get("/register",async(req,res,next)=>{
    try {
        res.render("register")
    } catch (error) {
        next(error)
    }
})

module.exports=router
