import jwt from "jsonwebtoken"
import User from "../models/user.js"
export const protectroute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt
        if(!token){
            return res.status(400).json({message:"no token"})
        }
        const decoded= jwt.verify(token,"my-secret")
        if(!decoded){
            return res.status(400).json({message:"invalid token"})
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(400).json({message:"invalid user"})
        }
        req.user=user
        next()
    }catch(error){
        return res.status(400).json({message:"internal server error"})
        console.log(error)
    }
}