import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv"
dotenv.config()
console.log("MONGO_URI:", process.env.Mongo_uri);
export const connectdb= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb conencted successfully")
    }catch(error){
        console.log(error)
    }
}